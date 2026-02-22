# Todo CLI

En enkel kommandolinje-app for å håndtere todo-oppgaver, skrevet i Node.js.

## Funksjonalitet

- Legge til nye oppgaver
- Liste alle oppgaver
- Markere oppgaver som ferdige
- Markere oppgaver som uferdige
- Automatisk backup ved endringer
- Slette en oppgave

## Installasjon
```bash
git clone <repo-url>
cd todo-cli
```

## Bruk
```bash
# Legge til oppgave
node todo.js add "Kjøpe melk"

# Liste alle oppgaver
node todo.js list

# Markere oppgave som ferdig
node todo.js check NUM

# Markere oppgave som uferdig
node todo.js uncheck NUM

# Slette oppgave
node todo.js del NUM
```

## Filstruktur

- `todo.js` - Hovedprogrammet
- `tasks.md` - Oppgavefilen (opprettes automatisk)
- `tasks.md.bak` - Backup av forrige versjon
- `completed.md` - Ferdige oppgaver (opprettes automatisk)
- `completed.md.bak` - Backup av forrige versjon av ferdige oppgaver

## Lært underveis

- Om `fs`-modulen: opprette fil, samt lese og skrive til den
- Backup-prosedyre
- Man overskriver hele filen, ikke linje for linje
- Håndtering av «edge-cases» og validering av fil og inn-data.
- «Newline»-håndtering
- Med mer

## Fremtidige forbedringer

- [x] Slette oppgaver
- [x] Fjerne ferdige oppgaver
- [ ] Prioritering av oppgaver
- [x] ID ved opprettese
- [ ] Konvertere fra markdown- til JSON-fil
