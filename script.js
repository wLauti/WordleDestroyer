fetch('allwords.txt')
    .then(response => response.text())
    .then(data => {
        const palabras = data.split('\n').map(p => p.trim()).filter(p => p !== '');
        let tamano = 0;
        let candidatos = [];
        let lastGuess = "";
        const commandInput = document.getElementById('commandInput');
        const output = document.getElementById('output');
        const consoleDiv = document.getElementById('console');

        function escribirSalida(texto) {
            const linea = document.createElement('div');
            linea.textContent = texto;
            output.appendChild(linea);
        }

        commandInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = commandInput.value.trim();
                escribirSalida("C:\\>" + command);
                if (command.toLowerCase().startsWith("length ")) {
                    const parts = command.split(" ");
                    const num = parseInt(parts[1]);
                    if (!isNaN(num) && num > 0) {
                        tamano = num;
                        candidatos = palabras.filter(p => p.length === tamano);
                        let startingWord = "";
                        if (tamano === 5 && candidatos.includes("salto")) {
                            startingWord = "salto";
                        } else {
                            startingWord = candidatos[0] || "";
                        }
                        lastGuess = startingWord;
                        escribirSalida("Sugerencia: " + startingWord);
                    } else {
                        escribirSalida("Formato incorrecto en 'length'. Usa: length <número>");
                    }
                } else if (/^[BMO]+$/i.test(command) && command.length === tamano) {
                    const feedback = command.toUpperCase();
                    candidatos = candidatos.filter(word => {
                        for (let i = 0; i < tamano; i++) {
                            const letra = lastGuess[i];
                            const fb = feedback[i];
                            if (fb === 'B') {
                                if (word[i] !== letra) return false;
                            } else if (fb === 'M') {
                                if (word.includes(letra)) return false;
                            } else if (fb === 'O') {
                                if (word[i] === letra) return false;
                                if (!word.includes(letra)) return false;
                            }
                        }
                        return true;
                    });
                    if (candidatos.length > 0) {
                        const nextGuess = candidatos[0];
                        lastGuess = nextGuess;
                        escribirSalida("Sugerencia: " + nextGuess);
                    } else {
                        escribirSalida("No hay palabras que cumplan los criterios.");
                    }
                } else {
                    escribirSalida("Comando no reconocido.");
                }
                commandInput.value = "";
                consoleDiv.scrollTop = consoleDiv.scrollHeight;
            }
        });
    });