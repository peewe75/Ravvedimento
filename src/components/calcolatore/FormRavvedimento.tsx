"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { useCalculatorStore, TRIBUTI } from "@/store/calculator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StepIndicator } from "./StepIndicator"
import { format } from "date-fns"
import { Calculator, Calendar, TrendingUp, ArrowRight, RotateCcw, Download, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { calcolaRavvedimento } from "@/lib/calcoli/ravvedimento"
import { saveCalcolo } from "@/lib/firebase/client"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { DocumentoPDF } from "../pdf/DocumentoPDF"

const calcoloSchema = z.object({
  codiceTributo: z.string().min(1, "Seleziona un tributo"),
  importoOriginale: z.string().min(1, "Inserisci un importo valido"),
  dataScadenza: z.string().min(1, "Seleziona la data di scadenza"),
  dataVersamento: z.string().min(1, "Seleziona la data di versamento"),
})

type CalcoloFormData = z.infer<typeof calcoloSchema>

export function FormRavvedimento() {
  const { step, input, setStep, setInput, calculate, reset, risultato, error } = useCalculatorStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset: resetForm,
  } = useForm<CalcoloFormData>({
    resolver: zodResolver(calcoloSchema),
    defaultValues: {
      codiceTributo: input.codiceTributo || "",
      importoOriginale: input.importoOriginale ? String(input.importoOriginale) : "",
      dataScadenza: input.dataScadenza ? format(input.dataScadenza, 'yyyy-MM-dd') : "",
      dataVersamento: input.dataVersamento ? format(input.dataVersamento, 'yyyy-MM-dd') : "",
    },
  })

  const selectedTributo = watch("codiceTributo")
  const importoVal = watch("importoOriginale")
  const dataScadenzaVal = watch("dataScadenza")
  const dataVersamentoVal = watch("dataVersamento")

  useEffect(() => {
    if (input.codiceTributo) setValue("codiceTributo", input.codiceTributo)
    if (input.importoOriginale) setValue("importoOriginale", String(input.importoOriginale))
    if (input.dataScadenza) setValue("dataScadenza", format(input.dataScadenza, 'yyyy-MM-dd'))
    if (input.dataVersamento) setValue("dataVersamento", format(input.dataVersamento, 'yyyy-MM-dd'))
  }, [])

  const { user } = useUser();

  const onSubmit = async (data: CalcoloFormData) => {
    const importo = parseFloat(data.importoOriginale);
    if (isNaN(importo) || importo <= 0) {
      return;
    }

    if (step === 1) {
      setInput({
        codiceTributo: data.codiceTributo,
        nomeTributo: TRIBUTI.find(t => t.codiceTributo === data.codiceTributo)?.nome || "",
        importoOriginale: importo,
      });
      setStep(2);
      return;
    }

    if (step === 2) {
      const scadenza = new Date(data.dataScadenza);
      const versamento = new Date(data.dataVersamento);

      setInput({
        codiceTributo: data.codiceTributo,
        importoOriginale: importo,
        dataScadenza: scadenza,
        dataVersamento: versamento,
      });

      calculate();

      // Se l'utente è loggato, salviamo il calcolo
      if (user) {
        // Il calcolo avviene nello store, quindi dobbiamo aspettare che sia pronto o ricalcolare qui per il salvataggio
        // Per semplicità, richiamiamo calcolaRavvedimento qui e salviamo
        try {
          const risultato = calcolaRavvedimento({
            importoOriginale: importo,
            dataScadenza: scadenza,
            dataVersamento: versamento,
            codiceTributo: data.codiceTributo,
            nomeTributo: TRIBUTI.find(t => t.codiceTributo === data.codiceTributo)?.nome || "",
          });
          await saveCalcolo(risultato, user.id);
        } catch (e) {
          console.error("Errore salvataggio calcolo:", e);
        }
      }
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2)
    } else if (step === 2) {
      setStep(1)
    }
  }

  const getBadgeVariant = () => {
    if (!risultato) return "default"
    switch (risultato.tipoRavvedimento) {
      case 'sprint_15': return 'sprint'
      case 'breve': return 'breve'
      case 'intermedio': return 'intermedio'
      case 'lungo': return 'lungo'
      case 'lunghissimo': return 'lunghissimo'
      default: return 'default'
    }
  }

  const groupedTributi = TRIBUTI.reduce((acc, t) => {
    if (!acc[t.categoria]) acc[t.categoria] = []
    acc[t.categoria].push(t)
    return acc
  }, {} as Record<string, typeof TRIBUTI>)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Calcolo Ravvedimento Operoso</CardTitle>
              <CardDescription>
                Inserisci i dati per calcolare sanzioni e interessi
              </CardDescription>
            </div>
          </div>
          <StepIndicator currentStep={step} />
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="codiceTributo">Tipo di Tributo</Label>
                  <select
                    id="codiceTributo"
                    {...register("codiceTributo")}
                    className="flex h-12 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Seleziona un tributo...</option>
                    {Object.entries(groupedTributi).map(([categoria, tributi]) => (
                      <optgroup key={categoria} label={categoria}>
                        {tributi.map(t => (
                          <option key={t.codiceTributo} value={t.codiceTributo}>
                            {t.codiceTributo} - {t.nome}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.codiceTributo && (
                    <p className="text-sm text-danger">{errors.codiceTributo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="importoOriginale">Importo Tributo Dovuto (€)</Label>
                  <Input
                    id="importoOriginale"
                    type="number"
                    step="0.01"
                    placeholder="es. 1250.00"
                    {...register("importoOriginale")}
                    className="monetario-value"
                  />
                  {errors.importoOriginale && (
                    <p className="text-sm text-danger">{errors.importoOriginale.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continua <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="dataScadenza">Data di Scadenza Originale</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                    <Input
                      id="dataScadenza"
                      type="date"
                      {...register("dataScadenza")}
                      className="pl-10"
                    />
                  </div>
                  {errors.dataScadenza && (
                    <p className="text-sm text-danger">{errors.dataScadenza.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataVersamento">Data di Versamento (oggi o prevista)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                    <Input
                      id="dataVersamento"
                      type="date"
                      {...register("dataVersamento")}
                      className="pl-10"
                    />
                  </div>
                  {errors.dataVersamento && (
                    <p className="text-sm text-danger">{errors.dataVersamento.message}</p>
                  )}
                </div>

                {dataScadenzaVal && dataVersamentoVal && (
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        Ritardo calcolato:{" "}
                        {Math.max(0, Math.floor(
                          (new Date(dataVersamentoVal).getTime() - new Date(dataScadenzaVal).getTime()) / (1000 * 60 * 60 * 24)
                        ))} giorni
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    Indietro
                  </Button>
                  <Button type="submit" className="flex-1" size="lg">
                    Calcola <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && risultato && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{risultato.nomeTipoRavvedimento}</h3>
                    <Badge variant={getBadgeVariant()}>
                      {risultato.giorniRitardo} giorni ritardo
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Importo originale tributo:</span>
                      <span className="font-semibold monetario-value">
                        € {risultato.input.importoOriginale.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Sanzione ridotta ({risultato.percentualeSanzioneRidotta.toFixed(2)}%):</span>
                      <span className="font-semibold monetario-value text-warning">
                        + € {risultato.sanzioneRidotta.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Interessi legali:</span>
                      <span className="font-semibold monetario-value text-primary">
                        + € {risultato.totaleInteressi.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>TOTALE DA VERSARE:</span>
                      <span className="text-primary monetario-value">
                        € {risultato.totaleDaVersare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {risultato.dettaglioInteressi.length > 0 && (
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="font-medium mb-3">Dettaglio Interessi</h4>
                    <div className="space-y-2">
                      {risultato.dettaglioInteressi.map((d) => (
                        <div key={d.anno} className="flex justify-between text-sm">
                          <span>Anno {d.anno} ({d.giorniInAnno} giorni, tasso {d.tassoPercentuale}%)</span>
                          <span className="monetario-value">€ {d.interessiAnno.toFixed(4)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={reset} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" /> Nuovo Calcolo
                  </Button>
                  <PDFDownloadLink
                    document={<DocumentoPDF risultato={risultato} />}
                    fileName={`ravvedimento_${risultato.input.codiceTributo}_${format(new Date(), 'dd-MM-yyyy')}.pdf`}
                    className="flex-1"
                  >
                    {({ loading }) => (
                      <Button type="button" variant="default" className="w-full" disabled={loading}>
                        {loading ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generazione...</>
                        ) : (
                          <><Download className="mr-2 h-4 w-4" /> Scarica PDF</>
                        )}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
