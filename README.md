# Todo CLI

En enkel kommandolinje-app for å håndtere todo-oppgaver, skrevet i Node.js.

## Funksjonalitet

- Legge til nye oppgaver
- Liste alle oppgaver
- Markere oppgaver som ferdige
- Automatisk backup ved endringer

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
node todo.js done 1
```

## Filstruktur

- `todo.js` - Hovedprogrammet
- `tasks.md` - Oppgavefilen (opprettes automatisk)
- `tasks.md.bak` - Backup av forrige versjon

## Lært underveis

- Om `fs`-modulen: opprette fil, samt lese og skrive til den
- Backup-prosedyre
- Man overskriver hele filen, ikke linje for linje
- Håndtering av «edge-cases» og validering av fil og inn-data.
- «Newline»-håndtering
- Med mer

## Fremtidige forbedringer

- [ ] Slette oppgaver
- [ ] Fjerne ferdige oppgaver
- [ ] Prioritering av oppgaver
- [ ] ID ved opprettese
