import { Calculator, FileText, History, Shield, Clock, CheckCircle } from "lucide-react"
import { FormRavvedimento } from "@/components/calcolatore/FormRavvedimento"

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900">RavvedimentoFacile</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
            <a href="#come-funziona" className="hover:text-primary transition-colors">Come funziona</a>
            <a href="#vantaggi" className="hover:text-primary transition-colors">Vantaggi</a>
            <a href="#prezzi" className="hover:text-primary transition-colors">Prezzi</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">
              Accedi
            </button>
            <button className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
              Prova Gratis
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                Il ravvedimento operoso, <span className="text-primary">finalmente semplice</span>
              </h1>
              <p className="text-lg text-neutral-600 max-w-lg">
                Calcola sanzioni e interessi legali in pochi secondi. 
                Sostituisci i tuoi fogli Excel con uno strumento professionale 
                sempre aggiornato alla normativa vigente.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Sempre aggiornato</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>PDF professionale</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Storico calcoli</span>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <FormRavvedimento />
            </div>
          </div>
        </section>

        <section id="come-funziona" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Come funziona</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Tre semplici passaggi per ottenere il tuo calcolo preciso e professionale
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Inserisci i dati",
                  description: "Seleziona il tributo e inserisci l'importo dovuto"
                },
                {
                  icon: Clock,
                  title: "Calcola",
                  description: "Specifica le date di scadenza e versamento"
                },
                {
                  icon: Calculator,
                  title: "Ottieni il risultato",
                  description: "Visualizza sanzioni, interessi e scarica il PDF"
                }
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="vantaggi" className="py-16 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Perché sceglierci</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Sempre aggiornato",
                  description: "Tassi di interesse e normative sempre allineati alla legge"
                },
                {
                  icon: FileText,
                  title: "PDF professionale",
                  description: "Documento pronto per il tuo cliente in formato professionale"
                },
                {
                  icon: History,
                  title: "Storico calcoli",
                  description: "Tieni traccia di tutti i calcoli effettuati"
                },
                {
                  icon: Calculator,
                  title: "Facile da usare",
                  description: "Interfaccia intuitiva progettata per professionisti"
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="prezzi" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Piani e prezzi</h2>
              <p className="text-neutral-600">Scegli il piano più adatto alle tue esigenze</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="border border-neutral-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">Free</h3>
                <p className="text-3xl font-bold text-neutral-900 mb-4">€0<span className="text-sm font-normal text-neutral-500">/mese</span></p>
                <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> 5 calcoli/mese</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Calcolo base</li>
                </ul>
                <button className="w-full py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
                  Inizia gratis
                </button>
              </div>
              
              <div className="border-2 border-primary rounded-xl p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  Più popolare
                </div>
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">Pro</h3>
                <p className="text-3xl font-bold text-neutral-900 mb-4">€19<span className="text-sm font-normal text-neutral-500">/mese</span></p>
                <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Calcoli illimitati</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> PDF professionale</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Storico completo</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Invio email</li>
                </ul>
                <button className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                  Prova gratis
                </button>
              </div>
              
              <div className="border border-neutral-200 rounded-xl p-6">
                <h3 className="font-semibold text-lg text-neutral-900 mb-2">Studio</h3>
                <p className="text-3xl font-bold text-neutral-900 mb-4">€49<span className="text-sm font-normal text-neutral-500">/mese</span></p>
                <ul className="space-y-2 text-sm text-neutral-600 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Tutto in Pro</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Fino a 5 utenti</li>
                  <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /> Supporto prioritario</li>
                </ul>
                <button className="w-full py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
                  Contattaci
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-bold">RavvedimentoFacile</span>
              </div>
              <p className="text-sm">Il calcolatore professionale per commercialisti e tributaristi.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Prodotto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Caratteristiche</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prezzi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Azienda</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Chi siamo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termini di servizio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-sm text-center">
            <p>&copy; 2026 RavvedimentoFacile. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
