import React, { useMemo } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { useParams, useNavigate } from 'react-router-dom';
import { teamStore } from '../../../services/teamStore';
import { Button } from '../../../components/ui/Button';

const TeamProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const m = useMemo(()=> id? teamStore.get(id): undefined, [id]);

  if (!m) return <AdminPage title="Team — Voir le membre">Inconnu</AdminPage>;
  const initials = (m.name||'?').split(' ').map(s=> s[0]).slice(0,2).join('').toUpperCase();

  return (
    <AdminPage title="Équipe — Voir le membre">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Identity card */}
        <div className="rounded-2xl bg-[var(--color-surface)] border p-4 space-y-3" style={{borderColor:'var(--color-border)'}}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--chip-bg)] flex items-center justify-center text-[14px] font-bold">{initials}</div>
            <div>
              <div className="text-[15px] font-semibold">{m.name}</div>
              <div className="text-[12px] text-[var(--muted-color)]">{m.email} • {m.phone||'—'}</div>
            </div>
          </div>
          <div className="text-[13px]">
            <div><span className="text-[var(--muted-color)]">Rôle:</span> {m.role==='manager'? 'Chef de projet':'Opératrice/Opérateur terrain'}</div>
            <div><span className="text-[var(--muted-color)]">Pays:</span> {m.country}</div>
            <div><span className="text-[var(--muted-color)]">Statut:</span> {m.status}</div>
            <div><span className="text-[var(--muted-color)]">Accès:</span> {m.lastAccess? new Date(m.lastAccess).toLocaleString(): '—'}</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(m.skills||[]).map(s=> <span key={s} className="px-2 py-1 rounded-full text-[12px] bg-[var(--chip-bg)]">{s}</span>)}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={()=> alert('Reset password (mock)')}>Réinit. mot de passe</Button>
            <Button variant="secondary" onClick={()=> navigate(`/admin/team/${m.id}/edit`)}>Éditer</Button>
          </div>
        </div>

        {/* Assigned projects + Activity */}
        <div className="lg:col-span-2 grid gap-4">
          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[13px]">Projets assignés</h3>
              <input placeholder="Rechercher proj / code..." className="h-8 px-2 rounded-full border" />
            </div>
            <table className="w-full text-[12px]">
              <thead className="text-[var(--muted-color)]">
                <tr className="text-left">
                  <th className="py-2">ID</th>
                  <th className="py-2">Nom</th>
                  <th className="py-2">Rôle</th>
                  <th className="py-2">Pays</th>
                  <th className="py-2">Dates</th>
                </tr>
              </thead>
              <tbody>
                {(m.assignedProjects||['D-2025-0926-001','D-2025-0503-004','D-2025-0110-003']).map((pid)=> (
                  <tr key={pid} className="border-t">
                    <td className="py-1.5">{pid}</td>
                    <td className="py-1.5">Gitega School Dignity Kits</td>
                    <td className="py-1.5">{m.role==='operator'? 'Opératrice terrain':'Chef de projet'}</td>
                    <td className="py-1.5">BI</td>
                    <td className="py-1.5">2025-03 → 2025-05</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[13px]">Activité récente (terrain & back-office)</h3>
              <div className="flex gap-2"><select className="h-8 px-2 rounded-full border"><option>Type</option></select><select className="h-8 px-2 rounded-full border"><option>Période</option></select><input className="h-8 px-2 rounded-full border" placeholder="Rechercher..."/></div>
            </div>
            <table className="w-full text-[12px]">
              <thead className="text-[var(--muted-color)]">
                <tr className="text-left">
                  <th className="py-2">Date/Heure</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Projet / Lieu</th>
                  <th className="py-2">Détails</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date:'2025-10-04 17:40', type:'Présence (mensuelle)', proj:'Gitega — Lycée A', det:'' },
                  { date:'2025-10-03 15:10', type:'Distribution', proj:'Gitega — Lycée B', det:'' },
                  { date:'2025-10-02 10:25', type:'Rapport', proj:'Kigali Schools Hygiene', det:'' },
                  { date:'2025-10-01 09:12', type:'Connexion', proj:'—', det:'' },
                ].map((row,i)=> (
                  <tr key={i} className="border-t">
                    <td className="py-1.5">{row.date}</td>
                    <td className="py-1.5">{row.type}</td>
                    <td className="py-1.5">{row.proj}</td>
                    <td className="py-1.5">{row.det||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documents + Notes */}
        <div className="lg:col-span-1 grid gap-4">
          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold text-[13px] mb-2">Documents (facultatif)</h3>
            <div className="rounded-xl border p-6 text-center text-[13px] text-[var(--muted-color)]">Carte d'identité • Attestation • Autres — Glissez-déposez / Cliquez pour téléverser</div>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface)] border p-4" style={{borderColor:'var(--color-border)'}}>
            <h3 className="font-semibold text-[13px] mb-2">Notes internes</h3>
            <div className="text-[13px] text-[var(--muted-color)]">{m.notes || 'Ex: Disponible l’après-midi. Renforcée sur WASH en septembre.'}</div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default TeamProfile;
