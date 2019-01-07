# Site Scripts #

## List of scripts ##
<<<<<<< HEAD
ActionsCount | Title                                             | Filename                                                   | Order
------------ | ------------------------------------------------- | ---------------------------------------------------------- | -----
109          | Felter                                            | 000010 - Felter                                            | 10
9            | Innholdstype - Prosjektloggelement                | 000020 - Innholdstype - Prosjektloggelement                | 20
2            | Innholdstype - Infoelement                        | 000030 - Innholdstype - Infoelement                        | 30
4            | Innholdstype - Gevinstoppfølging                  | 000040 - Innholdstype - Gevinstoppfølging                  | 40
7            | Innholdstype - Kommunikasjonselement              | 000050 - Innholdstype - Kommunikasjonselement              | 50
5            | Innholdstype - Sjekkpunkt                         | 000060 - Innholdstype - Sjekkpunkt                         | 60
14           | Innholdstype - Prosjektleveranse                  | 000070 - Innholdstype - Prosjektleveranse                  | 70
8            | Innholdstype - Interessent                        | 000080 - Innholdstype - Interessent                        | 80
10           | Innholdstype - Gevinst                            | 000090 - Innholdstype - Gevinst                            | 90
3            | Innholdstype - Endring                            | 000100 - Innholdstype - Endring                            | 100
1            | Innholdstype - Mulighet                           | 000110 - Innholdstype - Mulighet                           | 110
1            | Innholdstype - Risiko                             | 000120 - Innholdstype - Risiko                             | 120
7            | Innholdstype - Ressursallokering                  | 000130 - Innholdstype - Ressursallokering                  | 130
6            | Innholdstype - Milepæl                            | 000140 - Innholdstype - Milepæl                            | 140
7            | Innholdstype - Prosjektdokument                   | 000150 - Innholdstype - Prosjektdokument                   | 150
1            | Innholdstype - Prosjekthendelse                   | 000160 - Innholdstype - Prosjekthendelse                   | 160
2            | Innholdstype - Prosjektoppgave                    | 000170 - Innholdstype - Prosjektoppgave                    | 170
3            | Liste - Dokumenter                                | 000180 - Liste - Dokumenter                                | 180
3            | Liste - Endringsanalyse                           | 000190 - Liste - Endringsanalyse                           | 190
3            | Liste - Fasesjekkliste                            | 000200 - Liste - Fasesjekkliste                            | 200
3            | Liste - Gevinstanalyse og gevinstrealiseringsplan | 000210 - Liste - Gevinstanalyse og gevinstrealiseringsplan | 210
3            | Liste - Gevinstsoppfølging                        | 000220 - Liste - Gevinstsoppfølging                        | 220
3            | Liste - Informasjon                               | 000230 - Liste - Informasjon                               | 230
3            | Liste - Interessentregister                       | 000240 - Liste - Interessentregister                       | 240
3            | Liste - Kommunikasjonsplan                        | 000250 - Liste - Kommunikasjonsplan                        | 250
3            | Liste - Milepæler                                 | 000260 - Liste - Milepæler                                 | 260
3            | Liste - Møtekalender                              | 000270 - Liste - Møtekalender                              | 270
3            | Liste - Oppgaver                                  | 000280 - Liste - Oppgaver                                  | 280
3            | Liste - Prosjektleveranser                        | 000290 - Liste - Prosjektleveranser                        | 290
3            | Liste - Prosjektlogg                              | 000300 - Liste - Prosjektlogg                              | 300
3            | Liste - Ressursallokering                         | 000310 - Liste - Ressursallokering                         | 310
4            | Liste - Usikkerhet                                | 000320 - Liste - Usikkerhet                                | 320
14           | Navigasjon                                        | 002000 - Navigasjon                                        | 2000
1            | Setup extension                                   | 002100 - Setup extension                                   | 2100
1            | Koble til hub                                     | 002200 - Koble til hub                                     | 2200
1            | Forside                                           | 002300 - Forside                                           | 2300
1            | Regionale innstillinger                           | 002400 - Regionale innstillinger                           | 2400
=======
* 00010 - Innholdstype - Prosjektloggelement
* 00020 - Innholdstype - Infoelement
* 00030 - Innholdstype - Gevinstoppfølging
* 00040 - Innholdstype - Kommunikasjonselement
* 00050 - Innholdstype - Sjekkpunkt
* 00060 - Innholdstype - Prosjektleveranse
* 00070 - Innholdstype - Interessent
* 00080 - Innholdstype - Prosjektelement
* 00090 - Innholdstype - Gevinst
* 00100 - Innholdstype - Endring
* 00110 - Innholdstype - Mulighet
* 00120 - Innholdstype - Risiko
* 00130 - Innholdstype - Ressursallokering
* 00140 - Innholdstype - Milepæl
* 00150 - Innholdstype - Prosjektdokument
* 00160 - Innholdstype - Prosjekthendelse
* 00170 - Innholdstype - Prosjektoppgave
* 00180 - Liste - Dokumenter
* 00190 - Liste - Endringsanalyse
* 00200 - Liste - Fasesjekkliste
* 00210 - Liste - Gevinstanalyse og gevinstrealiseringsplan
* 00220 - Liste - Gevinstsoppfølging
* 00230 - Liste - Informasjon
* 00240 - Liste - Interessentregister
* 00250 - Liste - Kommunikasjonsplan
* 00260 - Liste - Milepæler
* 00270 - Liste - Møtekalender
* 00280 - Liste - Oppgaver
* 00290 - Liste - Prosjektleveranser
* 00300 - Liste - Prosjektlogg
* 00320 - Liste - Ressursallokering
* 00330 - Liste - Usikkerhet
* 00340 - Navigasjon
* 00400 - Setup extension
* 00500 - Koble til hub
* 00600 - Regionale innstillinger
* 00700 - Forside
>>>>>>> 340f73c576749e9975a26e5674be1e7be31a42bb

## Development ##
There's a number of scripts used in developing the site scripts.

### Environment settings ###
Make a copy of `config\env.sample.json` and name it `env.json`.

### Build-SiteScript.ps1 ###
TODO

### Deploy-SiteDesign.ps1 ###
TODO

### Generate-SiteScripts.ps1 ###
TODO

### Test-SiteDesign.ps1 ###
TODO 
