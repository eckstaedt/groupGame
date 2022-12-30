import './App.css';
import { Fragment, useState } from 'react'
import { Dialog } from '@headlessui/react'
import { IoMdCloseCircle, IoMdCog } from 'react-icons/io';
import { ImStatsBars } from 'react-icons/im';
import axios from 'axios';

function App() {
  const stands = "STANDS";
  let [isOpen, setIsOpen] = useState(false);
  let [isConfirmOpen, setIsConfirmOpen] = useState(false);
  let [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  let [isAnswerOpen, setIsAnswerOpen] = useState(false);
  let [isSettingsOpen, setIsSettingsOpen] = useState(false);
  let [curInterval, setCurInterval] = useState(undefined);
  let [dialogContent, setDialogContent] = useState(null);
  let [standings, setStandings] = useState({});
  let [actuals, setActuals] = useState(localStorage.getItem(stands) ? JSON.parse(localStorage.getItem(stands)) : []);

  let calculateStandings = () => {
    const currentStand = localStorage.getItem(stands) ? JSON.parse(localStorage.getItem(stands)) : undefined;
    const calculates = {};
    for (const team of teams) {
      calculates[team] = 0;
    }
    if (currentStand) {
      for (let i = 0; i < currentStand.length; i++) {
        const stand = currentStand[i];
        if (stand.winner !== "Keiner") {
          calculates[stand.winner] += stand.score;
        }
      }
      setStandings(calculates);
    } else {
      setStandings({});
    }
  }

  let getAnswerPerApi = async () => {
    if (dialogContent.answerApi) {
      const res = await axios.get(dialogContent.answerApi);
      if (res?.data?.total_population) {
        const today = res?.data?.total_population[0].population;
        const tomorrow = res?.data?.total_population[0].population;
        setPopulation(today, tomorrow);
        setCurInterval(setInterval(() => {
          setPopulation(today, tomorrow);
        }, 1000));
      } else {
        setDialogContent({
          ...dialogContent,
          answerApiRes: "7.947.420.443",
        });
      }
    }
  }

  let setPopulation = (today, tomorrow) => {
    const dt = new Date();
    const secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
    const diff = tomorrow - today;
    const answer = today + (secs - diff);
    setDialogContent({
      ...dialogContent,
      answerApiRes: `~${answer.toLocaleString("de")}`,
    });
  }
  let onDialogClose = (team) => {
    const currentStand = localStorage.getItem(stands) ? JSON.parse(localStorage.getItem(stands)) : undefined;
    if (currentStand) {
      currentStand.push({
        id: dialogContent.dialogTitle,
        winner: team,
        score: parseInt(dialogContent.title, 10),
      });
      localStorage.setItem(stands, JSON.stringify(currentStand));
    } else {
      localStorage.setItem(stands, JSON.stringify([{
        id: dialogContent.dialogTitle,
        winner: team,
        score: parseInt(dialogContent.title, 10),
      }]));
    }

    setActuals(JSON.parse(localStorage.getItem(stands)));
    setIsConfirmOpen(false);
    setIsOpen(false);
  };

  let reset = () => {
    localStorage.setItem(stands, "[]");
    setActuals([]);
    setStandings({});
    setIsSettingsOpen(false);
  };

  const teams = ["Team 1", "Team 2"];

  const header = [{
    title: "Familie",
    bg: "bg-emerald-600",
  }, {
    title: "Bibel",
    bg: "bg-amber-600",
  }, {
    title: "Aktion",
    bg: "bg-cyan-600",
  }, {
    title: "Schätzen",
    bg: "bg-purple-600",
  }];

  const fields = [{
    title: "10",
    dialogTitle: "Familie (10)",
    bg: "bg-emerald-400 hover:bg-emerald-600",
    bgDialog: "bg-emerald-600",
    task: "Wie lautet das Geburtsdatum von Reinhold Eckstädt (OPA)?",
    img: "https://images.unsplash.com/photo-1567067974934-75a3e4534c14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    answer: "15.12.1926",
  }, {
    title: "10",
    dialogTitle: "Bibel (10)",
    bg: "bg-amber-400 hover:bg-amber-600",
    bgDialog: "bg-amber-600",
    task: "Zitiert Kolosser 3, 16",
    answer: "Lasst das Wort des Christus reichlich in euch wohnen in aller Weisheit; lehrt und ermahnt einander und singt mit Psalmen und Lobgesängen und geistlichen Liedern dem Herrn lieblich in eurem Herzen.",
    img: "https://images.unsplash.com/photo-1581832098627-e668242add62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
  }, {
    title: "10",
    dialogTitle: "Aktion (10)",
    bg: "bg-cyan-400 hover:bg-cyan-600",
    bgDialog: "bg-cyan-600",
    task: "Smarties sortieren",
    taskInfo: "Jede Gruppe sucht sich eine Person aus. Gewinner ist die Gruppe, dessen Person schneller die Smarties sortiert hat.",
    img: "https://cdn.pixabay.com/photo/2012/06/27/15/02/candy-50838_1280.jpg",
  }, {
    title: "10",
    dialogTitle: "Schätzen (10)",
    bg: "bg-purple-400 hover:bg-purple-600",
    bgDialog: "bg-purple-600",
    task: "Wie viel wiegt ein normales Hühnerei (Größe M)?",
    answer: "~60 Gramm",
    img: "https://images.unsplash.com/photo-1547654387-6182475cfe3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80",
  }, {
    title: "20",
    dialogTitle: "Familie (20)",
    bg: "bg-emerald-400 hover:bg-emerald-600",
    bgDialog: "bg-emerald-600",
    task: "Wieviele Personen haben im Dezember Geburtstag?",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    answer: "5 (Markus, Lea, Mose, Ellie, Melanie)",
  }, {
    title: "20",
    dialogTitle: "Bibel (20)",
    bg: "bg-amber-400 hover:bg-amber-600",
    bgDialog: "bg-amber-600",
    task: "Was geschah früher? Die Enthauptung Johannes oder die Speisung der 5000?",
    answer: "Antwort: Die Enthauptung Johannes",
    info: "(Die Enthauptung Johannes -> Matthäus 14, 10; Die Speisung der 5000 -> Matthäus 14, 13-21)",
    img: "https://www.kunstnet.de/w0/35658/speilsung-der-5000.jpg",
  }, {
    title: "20",
    dialogTitle: "Aktion (20)",
    bg: "bg-cyan-400 hover:bg-cyan-600",
    bgDialog: "bg-cyan-600",
    task: "Becher wegpusten",
    img: "https://images.unsplash.com/photo-1575252663512-b25714ec27f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2674&q=80",
    taskInfo: "Zwei Gruppen spielen gegeneinandern. Wählt jeweils 3 Personen aus eurem Team aus. Nacheinander muss jede Person eine Reihe an Bechern mit der Luft eines Luftballons wegpusten.",
  }, {
    title: "20",
    dialogTitle: "Schätzen (20)",
    bg: "bg-purple-400 hover:bg-purple-600",
    bgDialog: "bg-purple-600",
    task: "Wie viele Smarties passen in einen Smart (Zweisitzer)?",
    img: "https://cdn.pixabay.com/photo/2012/06/27/15/02/candy-50838_1280.jpg",
    answer: "~7 Millionen",
  }, {
    title: "30",
    dialogTitle: "Familie (30)",
    bg: "bg-emerald-400 hover:bg-emerald-600",
    bgDialog: "bg-emerald-600",
    joker: "JOKER",
    img: "https://images.unsplash.com/photo-1618143511698-c2ebcdabb11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
  }, {
    title: "30",
    dialogTitle: "Bibel (30)",
    bg: "bg-amber-400 hover:bg-amber-600",
    bgDialog: "bg-amber-600",
    task: "Wie viel Verse hat der Judasbrief?",
    answer: "25",
    img: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3570&q=80",
  }, {
    title: "30",
    dialogTitle: "Aktion (30)",
    bg: "bg-cyan-400 hover:bg-cyan-600",
    bgDialog: "bg-cyan-600",
    task: "Becher stapeln",
    taskInfo: "Jede Gruppe wählt eine Person aus. Ziel ist es, so viele Becher wie möglich durch herausziehen eines Blattes ineinander zu stapeln.",
    img: "https://images.unsplash.com/photo-1608590843622-328066a145b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
  }, {
    title: "30",
    dialogTitle: "Schätzen (30)",
    bg: "bg-purple-400 hover:bg-purple-600",
    bgDialog: "bg-purple-600",
    task: "Aus wie vielen Wörtern besteht die Bibel?",
    answer: "~738.765 Wörter",
    img: "https://images.unsplash.com/photo-1497621122273-f5cfb6065c56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2274&q=80",
  }, {
    title: "40",
    dialogTitle: "Familie (40)",
    bg: "bg-emerald-400 hover:bg-emerald-600",
    bgDialog: "bg-emerald-600",
    task: "Wie lautet die Anzahl der Nachkommen unserer Familie nach Mama und Papa (30 Sekunden)?",
    answer: "43 Personen",
    img: "https://davidsdiy.com/wp-content/uploads/2017/06/Family-Silhouette-3.jpg",
  }, {
    title: "40",
    dialogTitle: "Bibel (40)",
    bg: "bg-amber-400 hover:bg-amber-600",
    bgDialog: "bg-amber-600",
    task: "Wie heißen die beiden Säulen vor dem Tempel, den Salomo gebaut hat?",
    answer: "Jachin und Boas",
    img: "salomo.jpeg",
    imgAnswer: "https://assetsnffrgf-a.akamaihd.net/assets/m/1001061228/X/art/1001061228_X_sub_lg.jpg",
    info: "1.Könige 7, 21"
  }, {
    title: "40",
    dialogTitle: "Aktion (40)",
    bg: "bg-cyan-400 hover:bg-cyan-600",
    bgDialog: "bg-cyan-600",
    task: "Muttern-Turm bauen",
    taskInfo: "Wählt eine Person aus eurer Gruppe aus. Welche Gruppe schafft es, innerhalt von 3 Minuten den höchsten Turm aus Muttern zu bauen nur mit einem Holzstäbchen?",
    img: "https://asienspiegel.ch/content/1-articles/2018/10/20181007-tokyo-tower-eine-japanische-ikone/5af1bba0-24a5-4fcc-b20e-f108a6326967.jpg"
  }, {
    title: "40",
    dialogTitle: "Schätzen (40)",
    bg: "bg-purple-400 hover:bg-purple-600",
    bgDialog: "bg-purple-600",
    task: "Wie viele Einwohner leben derzeit auf unserer Erde?",
    answerApi: "https://d6wn6bmjj722w.population.io/1.0/population/World/today-and-tomorrow/",
    answerApiRes: "",
    img: "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
  }]

  return (
    <div className="App">
      <div className="p-2 w-full h-screen gameBoard grid grid-cols-4 gap-2">
        {header.map((field) => {
          return (<div key={makeid()} className={`table text-white border-2 border-grey rounded ${field.bg}`}>
            <div className="table-cell align-middle">
              <h1 className="md:text-6xl text-xl">{field.title}</h1>
            </div>
          </div>)
        })}
        {fields.map((field) => {
          const played = actuals?.find((stand) => stand.id === field.dialogTitle);
          if (played) {
            return (<div key={makeid()} className={`relative table text-white ${field.bgDialog}`}>
              <div className="flex justify-center items-center absolute w-full h-full bg-white/80">
                <h1 className="text-neutral-700 md:text-5xl text-xl">{played.winner}</h1>
              </div>
              <div className="table-cell align-middle">
                <h1 className="md:text-8xl text-4xl">{field.title}</h1>
              </div>
            </div>)
          } else {
            return (<div key={makeid()} onClick={() => { setDialogContent(field); setIsOpen(true); }} className={`cursor-pointer table text-white border-2 border-grey rounded ${field.bg}`}>
              <div className="table-cell align-middle">
                <h1 className="md:text-8xl text-4xl">{field.title}</h1>
              </div>
            </div>)
          }
        })}
      </div>

      {actuals?.length ? (<div onClick={() => { calculateStandings(); setIsStatsDialogOpen(true); }} className="cursor-pointer hover:bg-slate-300 absolute bottom-4 right-4 rounded-full bg-slate-300/80 h-16 w-16">
        <ImStatsBars className="inline-block text-3xl h-full text-white text-center"></ImStatsBars>
      </div>) : (<></>)}

      <div onClick={() => { setIsSettingsOpen(true); }} className="cursor-pointer hover:bg-slate-300 absolute bottom-4 left-4 rounded-full bg-slate-300/80 h-16 w-16">
        <IoMdCog className="inline-block text-3xl h-full text-white text-center"></IoMdCog>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-white/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-12">
          <Dialog.Panel className={`text-center relative p-4 sm:w-[60%] w-[98%] h-full rounded ${dialogContent?.bgDialog}`}>
            <Dialog.Title className={`pb-4 text-center text-2xl md:text-6xl text-white`}>
              <div className="flex">
                <IoMdCloseCircle className="text-transparent"></IoMdCloseCircle>
                <div className="w-full">{dialogContent?.dialogTitle}</div>
                <IoMdCloseCircle className="text-6xl cursor-pointer" onClick={() => setIsConfirmOpen(true)}></IoMdCloseCircle>
              </div>
            </Dialog.Title>

            <div className="h-[90%]">
              <div className="pb-4 text-left text-white text-xl md:text-3xl">
                {dialogContent?.task}
              </div>
              {dialogContent?.taskInfo ? <div className="pb-4 text-left text-white text-md md:text-2xl">
                {dialogContent?.taskInfo}
              </div> : <></>}
              {dialogContent?.joker ? <div className="pb-4 text-center text-white text-2xl md:text-8xl">dialogContent?.joker</div> : <></>}
              {dialogContent?.img ? <div className="overflow-hidden mb-4 max-h-[95%]"><img className="w-full object-cover pb-4" alt="" src={dialogContent.img}></img></div> : <></>}
              {dialogContent?.answer || dialogContent?.answerApi ? <button onClick={() => { getAnswerPerApi(); setIsAnswerOpen(true); }} className="w-full text-2xl bg-white p-3 rounded">Lösung</button> : (<></>)}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isConfirmOpen}
        onClose={() => { }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-white/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-12">
          <Dialog.Panel className={`p-4 rounded-xl ${dialogContent?.bgDialog}`}>
            <Dialog.Title className={`text-center text-4xl text-white`}>
              Gewinner
            </Dialog.Title>

            <div className={`flex gap-4 pt-4 justify-around`}>
              {teams.map((team) => {
                return (
                  <div key={makeid()} onClick={() => onDialogClose(team)} className={`p-4 bg-white text-neutral-500 text-md md:text-xl rounded-xl hover:bg-white/80 cursor-pointer`}>{team}</div>
                )
              })}
              <div onClick={() => onDialogClose("Keiner")} className={`p-4 bg-white text-neutral-500 text-md md:text-xl rounded-xl hover:bg-white/80 cursor-pointer`}>Keiner</div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isStatsDialogOpen}
        onClose={() => setIsStatsDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-white/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-12">
          <Dialog.Panel onClick={() => setIsStatsDialogOpen(false)} className={`p-8 rounded-xl bg-slate-500`}>
            <Dialog.Title className={`text-center text-3xl md:text-6xl text-white`}>
              {actuals?.length === 16 ? 'Finaler Stand' : 'Aktueller Stand'}
            </Dialog.Title>

            <div className={`flex gap-8 pt-8 justify-around`}>
              {Object.keys(standings).map((teamId) => {
                return (
                  <Fragment key={makeid()}>
                    <div className={`text-center p-4 bg-white text-neutral-500 text-xl md:text-4xl rounded-xl`}>
                      <div>{teamId}</div>
                      <div className="pt-4 text-2xl md:text-6xl">{standings[teamId]}</div>
                    </div>
                  </Fragment>
                )
              })}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-white/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-12">
          <Dialog.Panel className={`p-8 rounded-xl bg-slate-500`}>
            <Dialog.Title className={`text-center text-4xl text-white`}>
              Einstellungen
            </Dialog.Title>

            <div className={`flex gap-8 pt-8 justify-around`}>
              <button onClick={() => reset()} className="p-2 text-white rounded bg-red-500 hover:bg-red-300">Spiel zurücksetzen</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isAnswerOpen}
        onClose={() => { clearInterval(curInterval); setIsAnswerOpen(false); }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-white/40" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-12">
          <Dialog.Panel className={`p-8 rounded-xl bg-slate-500`}>
            <Dialog.Title className={`text-center text-3xl md:text-5xl text-white`}>
              Antwort
            </Dialog.Title>

            <div className="pt-4 text-white text-xl md:text-3xl">{dialogContent?.answer}</div>
            <div className="pt-4 text-white text-xl md:text-3xl transition-all">{dialogContent?.answerApiRes}</div>
            <div className="pt-4 text-white text-md md:text-xl">{dialogContent?.info}</div>
            {dialogContent?.imgAnswer ? <img alt="" src={dialogContent.imgAnswer}></img> : <></>}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

function makeid() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default App;
