import {useEffect, useMemo, useState} from "react";

type Color = {
  name: string;
  color: string;
  correct: boolean;
};

const COLORS = [
  {
    name: "Rojo",
    color: "#f00",
    correct: false,
  },
  {
    name: "Verde",
    color: "#0f0",
    correct: false,
  },
  {
    name: "Azul",
    color: "#00f",
    correct: false,
  },
  {
    name: "Amarillo",
    color: "#ff0",
    correct: false,
  },
];

function App() {
  const [status, setStatus] = useState<"initial" | "playing" | "finished">("initial");
  const [time, setTime] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameColors, setGameColors] = useState<Color[]>([]);
  const correctColor = useMemo<Color>(
    () => gameColors.find((color) => color.correct)!,
    [gameColors],
  );

  useEffect(() => {
    let interval: number;

    if (status === "playing") {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [status]);

  const handlePlaying = () => {
    setStatus("playing");

    //setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const [correctColor, wrongColor] = COLORS.slice().sort(() => Math.random() - 0.5);

    setGameColors([{...correctColor, correct: true}, wrongColor].sort(() => Math.random() - 0.5));
  };

  const handleReset = () => {
    setStatus("initial");
    setTime(0);
    setScore(0);
  };

  const handleColorClick = (clickedColor: Color) => {
    if (clickedColor.correct) {
      setScore((score) => score + 1);

      if (score === 9) {
        setStatus("finished");
      } else {
        const [correctColor, wrongColor] = COLORS.slice().sort(() => Math.random() - 0.5);

        setGameColors(
          [{...correctColor, correct: true}, wrongColor].sort(() => Math.random() - 0.5),
        );
      }
    }
  };

  return (
    <main>
      <header>
        <h1>{score} puntos</h1>
        <h1>{time} segundos</h1>
      </header>
      {status === "playing" && (
        <section>
          <span style={{textTransform: "capitalize", color: gameColors[0].color}}>
            {correctColor?.name}
          </span>
        </section>
      )}
      <footer>
        {status === "initial" && <button onClick={handlePlaying}>Jugar</button>}
        {status === "finished" && <button onClick={handleReset}>Reiniciar</button>}
        {status === "playing" && (
          <>
            <button
              style={{width: 128, height: 128, backgroundColor: gameColors[0].color}}
              onClick={() => handleColorClick(gameColors[0])}
            />
            <button
              style={{width: 128, height: 128, backgroundColor: gameColors[1].color}}
              onClick={() => handleColorClick(gameColors[1])}
            />
          </>
        )}
      </footer>
    </main>
  );
}

export default App;
