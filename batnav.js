var player_id = 1;

const GameMatrix = class GameMatrix {
  constructor(mat1, mat2) {
    this.mat1 = mat1;
    this.mat2 = mat2;
    this.player_id = 1;
  }

  matrixGenerator(mat) {
    let tableHTML = "<br><table>";
    for (let i = 0; i < mat.length; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < mat[i].length; j++) {
        tableHTML += `<td data-id="${mat[i][j]}" row="${i}" column="${j}" style="height:48.4px; width:60.8px;background:rgb(107, 107, 114)"></td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</table>";
    return tableHTML;
  }

  listener() {
    let cells = document.querySelectorAll("td");

    cells.forEach((cell) => {
      cell.addEventListener("click", async function () {
        let cellRow = parseInt(this.getAttribute("row"));
        let cellColumn = parseInt(this.getAttribute("column"));
        let cellBateauId = parseInt(this.getAttribute("data-id"));

        const sonRouge = new Audio("./song/Bruit dexplosion.mp4");
        const sonBleu = new Audio("./song/bruit de plouf dans leau.mp3");

        if (cellBateauId !== 0) {
          cell.style.background = "red";
          sonRouge.play();
          setTimeout(() => sonRouge.pause(), 1000);
        } else {
          cell.style.background = "blue";
          sonBleu.play();
          setTimeout(() => sonBleu.pause(), 1000);
        }

        await Tirer(cellRow, cellColumn, cellBateauId);
        await Update();
        await checkBoatStatus();
        await Score();
        await checkVictory();

        if (cellBateauId === 0) {
          switchPlayer();
        }
      });
    });

    const switchPlayer = () => {
      //console.log(this.player_id);
      /* this.player_id === 1 ? 2 : 1;  */
      if (this.player_id === 1) {
        this.player_id = 2;
        player_id = this.player_id;
      } else {
        this.player_id = 1;
        player_id = this.player_id;
      }
      fetchAndDisplayTable(this.player_id, 10, 10);

      alert("cest le tour du player: " + this.player_id);
      console.log(this.player_id);
    };

    const Tirer = async (row, column, bateau_id) => {
      const data = { row, column, bateau_id };

      try {
        const response = await fetch("./toucher.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Tirer réponse :", result);
      } catch (error) {
        console.error("Erreur dans Tirer :", error);
      }
    };

    const Update = async () => {
      try {
        const playerId = this.player_id;

        if (!playerId) {
          console.error("player_id is not set.");
          return;
        }
        const response = await fetch(
          `updateJS.php?player_id=${encodeURIComponent(playerId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const data = await response.text();
        console.log("Réponse du serveur Update :", data);
      } catch (error) {
        console.error("Erreur dans Update :", error);
      }
    };

    const Score = async () => {
      try {
        const playerId = this.player_id;

        const response = await fetch("score.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `player_id=${encodeURIComponent(playerId)}`,
        });

        if (!response.ok) {
          throw new Error("Réponse du serveur incorrecte");
        }

        const data = await response.text();
        console.log("Score réponse :", data);

        document.getElementById("score2").innerHTML = data;
      } catch (error) {
        console.error("Erreur dans Score :", error);
      }
    };

    //==========================================================================================
    const checkBoatStatus = async () => {
      try {
        const playerId = player_id;

        if (!playerId) {
          console.error("player_id is not set.");
          return;
        }

        const response = await fetch(
          `./bateaux.php?player_id=${encodeURIComponent(playerId)}`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        // Récupérer la réponse du serveur
        const result = await response.json();

        // Gérer les erreurs de serveur renvoyées en JSON
        if (result.error) {
          console.error(result.error);
          const divReponse = document.getElementById("score2");
          divReponse.innerHTML = `<h2>${result.error}</h2>`;
          return;
        }

        const divReponse = document.getElementById("score2");
        divReponse.innerHTML = "";

        // Vérifier si le résultat est vide
        if (!Array.isArray(result) || result.length === 0) {
          divReponse.innerHTML =
            "<h2>Lancer un missile</h2>";
        } else {
          // Générer dynamiquement le tableau HTML avec les résultats
          let tableHTML = `
        <table style="width: 100%; " border="1">
          <thead>
            <tr>
              <th>Type de bateau</th>
              <th>Couler</th>
            </tr>
          </thead>
          <tbody>
      `;

          result.forEach((row) => {
            tableHTML += `
          <tr>
            <td>${row.type_bateau}</td>
            <td>${row.restant}</td>
          </tr>
        `;
          });

          tableHTML += "</tbody></table>";
          divReponse.innerHTML = tableHTML;
        }
      } catch (error) {
        console.error("Erreur dans checkBoatStatus :", error);
        const divReponse = document.getElementById("score2");
        divReponse.innerHTML =
          "Une erreur est survenue lors de la récupération des données.";
      }
    };
    const checkVictory = async () => {
      try {
        const playerId = this.player_id;
        if (!playerId) {
          console.error("player_id is not set.");
          return;
        }
        const response = await fetch(
          `./endGame.php?player_id=${encodeURIComponent(playerId)}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la vérification de la victoire");
        }
        const result = await response.json();
        if (result.victory) {
          alert("Félicitations, vous avez coulé tous les bateaux et gagné !");
          function refreshPage() {
            location.reload(); // Recharge la page actuelle
          }
           refreshPage();
        } else {
          console.log("Le jeu continue...");
        }
      } catch (error) {
        console.error("Erreur dans checkVictory:", error);
      }
    };

    //========================================================================================================================

    function generateMatrixFromData(data, rows, columns) {
      const matrix = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => ({ bateau_id: 0, touche: false }))
      );

      data.forEach((item) => {
        const { row, column, bateau_id, touche } = item;
        if (row < rows && column < columns) {
          matrix[row][column] = { bateau_id, touche };
        }
      });

      return matrix;
    }

    function matrixGenerator2(mat) {
      let tableHTML = "<br><table>";

      for (let i = 0; i < mat.length; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < mat[i].length; j++) {
          const { bateau_id, touche } = mat[i][j];

          let bgColor = "rgb(107, 107, 114)"; // Gris par défaut (touche == false)
          if (touche && bateau_id > 0) {
            //bgColor = bateau_id !== 0 ? "red" : "rgb(107, 107, 114)"; // Rouge si bateau_id ≠ 0, sinon bleu
            bgColor = "red";
          }
          if (touche && bateau_id == 0) {
            //bgColor = bateau_id !== 0 ? "red" : "rgb(107, 107, 114)"; // Rouge si bateau_id ≠ 0, sinon bleu
            bgColor = "blue";
          }

          tableHTML += `<td data-id="${bateau_id}" row="${i}" column="${j}" 
                    style="height:48.4px; width:60.8px; background:${bgColor}">
                   </td>`;
        }
        tableHTML += "</tr>";
      }
      tableHTML += "</table>";
      return tableHTML;
    }

    // Fonction principale pour récupérer les données et afficher le tableau
    function fetchAndDisplayTable(playerId, rows, columns) {
      fetch("./changeGrid.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: playerId }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "success") {
            const gameData = result.data;

            // Transformer les données en matrice
            const matrix = generateMatrixFromData(gameData, rows, columns);

            // Générer et afficher le tableau HTML
            const tableHTML = matrixGenerator2(matrix);
            document.getElementById("game").innerHTML = tableHTML;
            //************************************************************************************************************* */rep de code
            let cells = document.querySelectorAll("td");

            cells.forEach((cell) => {
              cell.addEventListener("click", async function () {
                let cellRow = parseInt(this.getAttribute("row"));
                let cellColumn = parseInt(this.getAttribute("column"));
                let cellBateauId = parseInt(this.getAttribute("data-id"));

                const sonRouge = new Audio("./song/Bruit dexplosion.mp4");
                const sonBleu = new Audio(
                  "./song/bruit de plouf dans leau.mp3"
                );

                if (cellBateauId !== 0) {
                  cell.style.background = "red";
                  sonRouge.play();
                  setTimeout(() => sonRouge.pause(), 1000);
                } else {
                  cell.style.background = "blue";
                  sonBleu.play();
                  setTimeout(() => sonBleu.pause(), 1000);
                }

                await Tirer(cellRow, cellColumn, cellBateauId);
                await Update();
                await checkBoatStatus();
                await Score();
                await checkVictory();

                if (cellBateauId === 0) {
                  switchPlayer();
                }
              });
            });
            //************************************************************************************************************* */
          } else {
            console.error("Erreur:", result.message);
          }
        })
        .catch((error) => console.error("Erreur réseau:", error));
    }

    //========================================================================================================================
  }

  render() {
    const elbody = document.getElementById("game");
    elbody.innerHTML = this.matrixGenerator(this.mat1);
  }

  run() {
    this.render();
    this.listener();
  }
};

const mat1 = [
  [31, 0, 0, 0, 0, 0, 0, 21, 21, 0],
  [31, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [31, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 22, 22, 0, 0, 0],
  [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 5, 0, 0, 0, 4],
  [32, 32, 32, 0, 0, 5, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const mat2 = [
  [131, 131, 131, 0, 0, 0, 0, 0, 121, 121],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 122, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 122, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 15, 0, 0, 0, 14],
  [132, 0, 0, 0, 0, 15, 0, 0, 0, 14],
  [132, 0, 0, 0, 0, 15, 0, 0, 0, 14],
  [132, 0, 0, 0, 0, 15, 0, 0, 0, 14],
  [0, 0, 0, 0, 0, 15, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const game = new GameMatrix(mat1, mat2);
game.run();
