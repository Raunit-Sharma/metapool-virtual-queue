import { useState, useEffect } from 'react';
import { Users, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase, type Participant, type QueueSettings } from '../lib/supabase';

export default function PublicQueue() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [queueSettings, setQueueSettings] = useState<QueueSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    // Auto-refresh every 10 seconds
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
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const currentToken = queueSettings?.current_token || 0;
  const currentParticipant = participants.find(p => p.token_number === currentToken);
  const nextParticipant = participants.find(p => p.token_number === currentToken + 1);
  const waitingCount = participants.filter(p => p.token_number > currentToken && p.status !== 'completed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading queue...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 sm:mb-4">
            METAPOOL
          </h1>
          <p className="text-lg sm:text-xl text-blue-200 mb-4">Virtual Queue System</p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-xs sm:text-sm mb-1">Total in Queue</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">{participants.length}</p>
              </div>
              <div className="bg-blue-500/30 p-2 sm:p-3 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-xs sm:text-sm mb-1">Current Token</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">{currentToken}</p>
              </div>
              <div className="bg-green-500/30 p-2 sm:p-3 rounded-lg">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-200" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-xs sm:text-sm mb-1">Waiting</p>
                <p className="text-3xl sm:text-4xl font-bold text-white">{waitingCount}</p>
              </div>
              <div className="bg-orange-500/30 p-2 sm:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Current Player - Prominent Display */}
        {currentParticipant && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
            <div className="text-center">
              <p className="text-green-100 text-sm sm:text-base mb-2">🎯 NOW SERVING</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-3">
                <div className="text-center">
                  <p className="text-5xl sm:text-7xl font-bold">#{currentParticipant.token_number}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold mb-1">{currentParticipant.name}</p>
                  <p className="text-lg sm:text-xl text-green-100">Roll No: {currentParticipant.roll_no}</p>
                </div>
              </div>
              <p className="text-green-50 text-sm sm:text-base">Please proceed to the counter</p>
            </div>
          </div>
        )}

        {/* Next in Line */}
        {nextParticipant && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
            <div className="text-center">
              <p className="text-orange-100 text-xs sm:text-sm mb-2">⏭️ NEXT IN LINE</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <p className="text-3xl sm:text-4xl font-bold">#{nextParticipant.token_number}</p>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-semibold">{nextParticipant.name}</p>
                  <p className="text-sm sm:text-base text-orange-100">Roll No: {nextParticipant.roll_no}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Queue List - Mobile Optimized */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Complete Queue</h2>

          {participants.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-blue-200 text-base sm:text-lg">No participants in queue yet</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {participants.map((participant) => {
                const isCurrentToken = participant.token_number === currentToken;
                const isCompleted = participant.token_number < currentToken || participant.status === 'completed';
                const isNext = participant.token_number === currentToken + 1;

                return (
                  <div
                    key={participant.id}
                    className={`
                      rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all
                      ${isCurrentToken ? 'bg-green-500/30 border-2 border-green-400 shadow-lg scale-105' : ''}
                      ${isNext ? 'bg-orange-500/30 border-2 border-orange-400' : ''}
                      ${!isCurrentToken && !isNext && !isCompleted ? 'bg-white/5 border border-white/10' : ''}
                      ${isCompleted ? 'bg-gray-500/20 border border-gray-500/30 opacity-60' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className={`
                          text-2xl sm:text-3xl font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-lg
                          ${isCurrentToken ? 'bg-green-600 text-white' : ''}
                          ${isNext ? 'bg-orange-600 text-white' : ''}
                          ${!isCurrentToken && !isNext ? 'bg-blue-600 text-white' : ''}
                          ${isCompleted ? 'bg-gray-600 text-gray-300' : ''}
                        `}>
                          #{participant.token_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-base sm:text-lg truncate">
                            {participant.name}
                          </p>
                          <p className="text-blue-200 text-xs sm:text-sm">
                            Roll No: {participant.roll_no}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isCurrentToken && (
                          <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-full whitespace-nowrap">
                            Current
                          </span>
                        )}
                        {isNext && !isCurrentToken && (
                          <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-orange-600 text-white rounded-full whitespace-nowrap">
                            Next
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-gray-600 text-gray-200 rounded-full whitespace-nowrap">
                            {participant.status === 'completed' ? 'Completed' : 'Done'}
                          </span>
                        )}
                        {!isCurrentToken && !isNext && !isCompleted && (
                          <span className="px-2 sm:px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full whitespace-nowrap">
                            Waiting
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 sm:mt-6 pt-4 border-t border-white/20">
            <p className="text-xs sm:text-sm text-blue-200 text-center">
              ⏱️ Auto-refreshes every 10 seconds • Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
