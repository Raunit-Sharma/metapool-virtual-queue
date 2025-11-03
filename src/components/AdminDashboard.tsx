import { useState, useEffect } from 'react';
import { Users, Clock, UserCheck, Plus, ChevronRight, LogOut, CheckCircle } from 'lucide-react';
import { supabase, type Participant, type QueueSettings, type AdminUser } from '../lib/supabase';

interface AdminDashboardProps {
  admin: AdminUser;
  onLogout: () => void;
}

export default function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [queueSettings, setQueueSettings] = useState<QueueSettings | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', rollNo: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [participantsRes, settingsRes] = await Promise.all([
        supabase.from('participants').select('*').order('token_number', { ascending: true }),
        supabase.from('queue_settings').select('*').eq('id', 1).maybeSingle()
      ]);

      if (participantsRes.data) setParticipants(participantsRes.data);
      if (settingsRes.data) setQueueSettings(settingsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('participants')
        .insert([{ name: formData.name, roll_no: formData.rollNo }]);

      if (insertError) throw insertError;

      setFormData({ name: '', rollNo: '' });
      setShowAddForm(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add participant');
    }
  };

  const advanceToken = async () => {
    if (!queueSettings) return;

    const nextToken = queueSettings.current_token + 1;
    const { error } = await supabase
      .from('queue_settings')
      .update({ current_token: nextToken, updated_at: new Date().toISOString(), updated_by: admin.id })
      .eq('id', 1);

    if (!error) loadData();
  };

  const markAsCompleted = async (participantId: string) => {
    try {
      const { error } = await supabase
        .from('participants')
        .update({ status: 'completed' })
        .eq('id', participantId);

      if (error) throw error;
      loadData();
    } catch (err) {
      console.error('Error marking participant as completed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update participant');
    }
  };

  const nextParticipant = participants.find(p => p.token_number === (queueSettings?.current_token || 0) + 1);
  const waitingCount = participants.filter(p => p.token_number > (queueSettings?.current_token || 0) && p.status !== 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">METAPOOL Admin</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome, {admin.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Registered</p>
                <p className="text-3xl font-bold text-gray-900">{participants.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Current Token</p>
                <p className="text-3xl font-bold text-blue-600">{queueSettings?.current_token || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Waiting in Queue</p>
                <p className="text-3xl font-bold text-gray-900">{waitingCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {nextParticipant && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-green-100 text-xs sm:text-sm mb-2">Next Participant</p>
                <p className="text-xl sm:text-2xl font-bold mb-1">Token #{nextParticipant.token_number}</p>
                <p className="text-base sm:text-lg">{nextParticipant.name}</p>
                <p className="text-sm sm:text-base text-green-100">Roll No: {nextParticipant.roll_no}</p>
              </div>
              <button
                onClick={advanceToken}
                className="w-full sm:w-auto bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                Call Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Participants Queue</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-5 h-5" />
              Add Participant
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={addParticipant} className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Participant Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  placeholder="Roll Number"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  required
                  className="px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              {error && <p className="text-red-600 text-xs sm:text-sm mb-4">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base">
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setError('');
                  }}
                  className="flex-1 sm:flex-none bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {participants.map((participant) => (
                  <tr
                    key={participant.id}
                    className={
                      participant.token_number === queueSettings?.current_token
                        ? 'bg-green-50'
                        : participant.token_number < (queueSettings?.current_token || 0)
                        ? 'bg-gray-50 opacity-60'
                        : ''
                    }
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="font-bold text-base sm:text-lg text-blue-600">#{participant.token_number}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-900 text-sm sm:text-base">{participant.name}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-600 text-sm sm:text-base">{participant.roll_no}</td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-600 text-xs sm:text-sm">
                      {new Date(participant.registered_at).toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      {participant.token_number === queueSettings?.current_token ? (
                        <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                          Current
                        </span>
                      ) : participant.token_number < (queueSettings?.current_token || 0) ? (
                        <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                          Done
                        </span>
                      ) : participant.status === 'completed' ? (
                        <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                          Waiting
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      {participant.status === 'waiting' && participant.token_number > (queueSettings?.current_token || 0) ? (
                        <button
                          onClick={() => markAsCompleted(participant.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          title="Mark as completed"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Complete</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
