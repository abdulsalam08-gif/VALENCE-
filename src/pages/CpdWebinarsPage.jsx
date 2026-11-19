import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, Loader2, Award, Clock, Video, CheckCircle2,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { useToast } from '../context/ToastContext';
import Badge from '../components/ui/Badge';
import {
  fetchCpdWebinars,
  registerCpdWebinar,
  fetchMyCpdRegistrations,
} from '../lib/opportunities';

function fmtDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(iso);
  }
}

export default function CpdWebinarsPage() {
  const { user } = usePlatform();
  const toast = useToast();
  const [webinars, setWebinars] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [w, m] = await Promise.all([
        fetchCpdWebinars(50),
        user ? fetchMyCpdRegistrations(50) : Promise.resolve([]),
      ]);
      setWebinars(w || []);
      setMyRegs(m || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => { load(); }, [load]);

  async function handleRegister(wb) {
    try {
      await registerCpdWebinar(wb.id);
      toast.success('Registered — your CPD certificate will be issued after attendance.');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  }

  const registeredIds = new Set(myRegs.map((r) => r.webinar_id));

  const upcoming = webinars.filter((w) => w.status === 'published');

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="space-y-2">
        <Link to="/" className="text-xs text-[#9AA4B2] hover:text-white">← VALENCE home</Link>
        <Badge variant="green">VALENCE CPE / CPD</Badge>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Continuing Professional Education Webinars</h1>
        <p className="text-sm text-[#9AA4B2] max-w-2xl">
          Live CPE and CPD webinars for accountants and finance professionals. Register, attend, and earn CPD certificates that count toward your continuing education requirements.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setTab('upcoming')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === 'upcoming' ? 'bg-[#16C784] text-[#06130D]' : 'border border-white/[0.08] text-[#9AA4B2] hover:bg-white/[0.04]'}`}
        >
          Upcoming Webinars
        </button>
        <button
          onClick={() => setTab('mine')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === 'mine' ? 'bg-[#16C784] text-[#06130D]' : 'border border-white/[0.08] text-[#9AA4B2] hover:bg-white/[0.04]'}`}
        >
          My CPD Record ({myRegs.length})
        </button>
      </div>

      <div className="mt-6">
        {tab === 'upcoming' && (
          loading ? (
            <div className="p-10 text-center text-[#9AA4B2]"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
          ) : upcoming.length === 0 ? (
            <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-[#9AA4B2]">
              No webinars are open for registration right now. Check back soon.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {upcoming.map((w) => {
                const registered = registeredIds.has(w.id);
                const full = w.registered_count >= w.capacity;
                return (
                  <article key={w.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={w.webinar_type === 'CPE' ? 'verified' : 'official'}>{w.webinar_type}</Badge>
                        <span className="text-[11px] text-[#9AA4B2]">{w.registered_count}/{w.capacity} registered</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{w.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#9AA4B2]">{w.description}</p>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#9AA4B2]">
                      <p className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#16C784]" /> {fmtDateTime(w.start_time)}</p>
                      <p className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-[#16C784]" /> {w.cpd_hours} CPD hours</p>
                      {w.meeting_link && (
                        <a href={w.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#16C784] hover:underline">
                          <Video className="h-3.5 w-3.5" /> Join meeting link
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => handleRegister(w)}
                      disabled={registered || full || !user}
                      className="mt-auto rounded-lg bg-[#16C784] px-4 py-2 text-sm font-semibold text-[#06130D] disabled:opacity-40"
                    >
                      {registered ? 'Registered' : full ? 'Full' : user ? 'Register' : 'Sign in to register'}
                    </button>
                  </article>
                );
              })}
            </div>
          )
        )}

        {tab === 'mine' && (
          loading ? (
            <div className="p-10 text-center text-[#9AA4B2]"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>
          ) : myRegs.length === 0 ? (
            <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center text-sm text-[#9AA4B2]">
              You haven't registered for any webinars yet.
            </p>
          ) : (
            <div className="space-y-3">
              {myRegs.map((r) => (
                <div key={r.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={r.webinar_type === 'CPE' ? 'verified' : 'official'}>{r.webinar_type}</Badge>
                        <Badge variant={r.status === 'certified' ? 'verified' : r.status === 'attended' ? 'live' : 'neutral'}>{r.status}</Badge>
                      </div>
                      <h3 className="mt-2 font-semibold text-white">{r.title}</h3>
                      <p className="mt-1 text-xs text-[#9AA4B2]">{fmtDateTime(r.start_time)} · {r.cpd_hours_awarded ?? r.webinar_type}</p>
                    </div>
                  </div>
                  {r.certificate_number && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#16C784]/30 bg-[#16C784]/[0.06] px-3 py-2">
                      <Award className="h-4 w-4 text-[#16C784]" />
                      <div>
                        <p className="text-sm font-medium text-white">CPD Certificate</p>
                        <p className="text-[11px] text-[#9AA4B2]">{r.certificate_number} · {r.cpd_hours_awarded} hours</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
