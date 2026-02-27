"use client";

import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { getFirestoreDB, getStoricoCalcoli } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { Calculator, FileText, History, Clock, CheckCircle, TrendingUp, Download, Shield } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const [trialInfo, setTrialInfo] = useState<any>(null);
    const [storico, setStorico] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (isLoaded && user) {
                const db = getFirestoreDB();
                const userDoc = await getDoc(doc(db, "users", user.id));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const startDate = data.trialStartDate?.toDate() || new Date();
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + (data.trialDays || 14));

                    const now = new Date();
                    const diffTime = endDate.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    setTrialInfo({
                        ...data,
                        daysRemaining: Math.max(0, diffDays),
                        endDate
                    });
                }

                const calcoli = await getStoricoCalcoli(user.id);
                setStorico(calcoli);
                setLoading(false);
            }
        }
        fetchData();
    }, [user, isLoaded]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-12">
            <header className="bg-white border-b border-neutral-200">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <Calculator className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-neutral-900">RavvedimentoFacile</span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-neutral-500">Ciao, {user?.firstName}</span>
                        <Link href="/" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                            Nuovo Calcolo
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Trial Status Card */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Il tuo periodo di prova</h1>
                            <p className="text-neutral-600">
                                Hai accesso a tutte le funzionalità Pro per {trialInfo?.trialDays || 14} giorni.
                            </p>
                        </div>
                        <div className="bg-primary/5 px-6 py-4 rounded-xl border border-primary/10 text-center min-w-[200px]">
                            <div className="text-3xl font-bold text-primary mb-1">{trialInfo?.daysRemaining}</div>
                            <div className="text-xs font-semibold text-primary uppercase tracking-wider">Giorni rimanenti</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/10">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span className="text-sm font-medium text-neutral-800">Sempre aggiornato</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/10">
                            <FileText className="h-5 w-5 text-success" />
                            <span className="text-sm font-medium text-neutral-800">PDF professionale</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/10">
                            <History className="h-5 w-5 text-success" />
                            <span className="text-sm font-medium text-neutral-800">Storico calcoli</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                                <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Storico calcoli recenti
                                </h2>
                                <Link href="/" className="text-sm text-primary hover:underline font-medium">
                                    Vedi tutti
                                </Link>
                            </div>

                            <div className="divide-y divide-neutral-100">
                                {storico.length === 0 ? (
                                    <div className="p-12 text-center text-neutral-500">
                                        <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>Non hai ancora effettuato alcun calcolo.</p>
                                        <Link href="/" className="text-primary mt-2 inline-block hover:underline font-medium">Inizia ora</Link>
                                    </div>
                                ) : (
                                    storico.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-neutral-900">
                                                        {item.nomeTributo || `Tributo ${item.codiceTributo}`}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {format(item.createdAt?.toDate() || new Date(), "d MMMM yyyy", { locale: it })}
                                                        </span>
                                                        <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                                                            {item.codiceTributo}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-neutral-900">
                                                        € {item.totaleDaVersare?.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    <span className="text-xs text-neutral-500 font-medium">
                                                        Importo base: € {item.importoOriginale?.toLocaleString('it-IT')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 mt-4">
                                                <div className="text-xs">
                                                    <span className="text-neutral-500 block">Sanzione</span>
                                                    <span className="font-semibold text-neutral-900">€ {item.sanzioneRidotta?.toFixed(2)}</span>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="text-neutral-500 block">Interessi</span>
                                                    <span className="font-semibold text-neutral-900">€ {item.totaleInteressi?.toFixed(2)}</span>
                                                </div>
                                                <div className="ml-auto">
                                                    <button className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors border border-primary/10">
                                                        <Download className="h-3.5 w-3.5" />
                                                        Scarica PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Useful info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                            <h3 className="font-bold text-neutral-900 mb-4">Supporto normativo</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-3 w-3 text-success" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 leading-tight">Riforma 2024</p>
                                        <p className="text-xs text-neutral-500 mt-1">Calcoli aggiornati al D.Lgs. 87/2024</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-3 w-3 text-success" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 leading-tight">Tassi 2026</p>
                                        <p className="text-xs text-neutral-500 mt-1">Sempre allineati al MEF</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Shield className="h-24 w-24" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">Passa a Pro</h3>
                            <p className="text-sm text-neutral-400 mb-6 relative z-10">Sblocca calcoli illimitati e salvataggio automatico per il tuo studio.</p>
                            <button className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors relative z-10 shadow-lg shadow-primary/20">
                                Abbonati ora
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
