'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Search, 
  Brain, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  RefreshCw,
  Stars
} from 'lucide-react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSupabase } from './SupabaseProvider';

type GameMode = 'trivia' | 'scramble' | 'whoami' | 'selig-spark';

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface ScrambleWord {
  id: string;
  scrambled: string;
  original: string;
  hint: string;
}

interface WhoAmI {
  id: string;
  riddle: string;
  answer: string;
  hint: string;
}

const TRIVIA: TriviaQuestion[] = [
  { id: "t1", question: "Who was the youngest king to rule over Judah?", options: ["Josiah", "Joash", "Manasseh", "Uzziah"], answer: "Joash", explanation: "Joash was only seven years old when he began to reign (2 Kings 11:21)." },
  { id: "t2", question: "In what city were the followers of Jesus first called Christians?", options: ["Jerusalem", "Antioch", "Damascus", "Rome"], answer: "Antioch", explanation: "Acts 11:26 states that 'in Antioch the disciples were first called Christians.'" },
  { id: "t3", question: "Which of these women is mentioned in the genealogy of Jesus in Matthew 1?", options: ["Sarah", "Rebekah", "Rahab", "Esther"], answer: "Rahab", explanation: "Matthew 1:5 mentions Rahab as the mother of Boaz." },
  { id: "t4", question: "What was the first miracle Jesus performed?", options: ["Healing a leper", "Walking on water", "Turning water into wine", "Raising Lazarus"], answer: "Turning water into wine", explanation: "Jesus turned water into wine at the wedding in Cana (John 2:1-11)." },
  { id: "t5", question: "How many people were on Noah's Ark?", options: ["2", "4", "8", "12"], answer: "8", explanation: "Noah, his wife, his three sons, and their wives (Genesis 7:13)." },
  { id: "t6", question: "Who recognized Jesus as the Messiah when he was presented at the Temple as a baby?", options: ["Simeon", "Nicodemus", "Zacchaeus", "Lazarus"], answer: "Simeon", explanation: "Simeon had been promised he wouldn't die before seeing the Lord's Christ (Luke 2:25-32)." },
  { id: "t7", question: "Which disciple was a tax collector before following Jesus?", options: ["Peter", "Andrew", "Matthew", "John"], answer: "Matthew", explanation: "Matthew (also called Levi) was sitting at the tax collector's booth when Jesus called him (Matthew 9:9)." },
  { id: "t8", question: "Who was the woman who had seven demons cast out of her?", options: ["Mary Magdalene", "Martha", "Lydia", "Priscilla"], answer: "Mary Magdalene", explanation: "Luke 8:2 mentions Mary called Magdalene, from whom seven demons had gone out." },
  { id: "t9", question: "Which book of the Bible follows the Gospels?", options: ["Romans", "Acts", "Hebrews", "Revelation"], answer: "Acts", explanation: "The Acts of the Apostles follows the four Gospels." },
  { id: "t10", question: "What is the shortest verse in the Bible?", options: ["Jesus wept.", "Rejoice evermore.", "Pray without ceasing.", "God is love."], answer: "Jesus wept.", explanation: "John 11:35 consists of only two words." },
  { id: "t11", question: "Who was the first martyr of the early church?", options: ["Peter", "Stephen", "James", "Paul"], answer: "Stephen", explanation: "Acts 7 describes the stoning of Stephen." },
  { id: "t12", question: "Which mountain did Moses receive the Ten Commandments on?", options: ["Mt. Nebo", "Mt. Carmel", "Mt. Sinai", "Mt. Ararat"], answer: "Mt. Sinai", explanation: "Exodus 19-20 tells of God meeting Moses on Sinai." },
  { id: "t13", question: "How many books are in the New Testament?", options: ["27", "39", "66", "12"], answer: "27", explanation: "There are 27 books in the NT and 39 in the Old Testament." },
  { id: "t14", question: "Who was the wife of Isaac?", options: ["Sarah", "Rebekah", "Rachel", "Leah"], answer: "Rebekah", explanation: "Genesis 24 tells how Rebekah became Isaac's wife." },
  { id: "t15", question: "What was the name of the garden where Jesus prayed before his crucifixion?", options: ["Eden", "Gethsemane", "Sharon", "Carmel"], answer: "Gethsemane", explanation: "Jesus prayed in Gethsemane on the Mount of Olives (Matthew 26)." },
  { id: "t16", question: "Who was the first king of Israel?", options: ["David", "Saul", "Solomon", "Samuel"], answer: "Saul", explanation: "Saul was anointed by Samuel as the first king (1 Samuel 10)." },
  { id: "t17", question: "Which sea did the Israelites cross to escape Egypt?", options: ["Dead Sea", "Red Sea", "Mediterranean Sea", "Sea of Galilee"], answer: "Red Sea", explanation: "God parted the Red Sea for them to cross on dry ground (Exodus 14)." },
  { id: "t18", question: "How many days and nights did it rain during the Great Flood?", options: ["7", "12", "40", "100"], answer: "40", explanation: "It rained for 40 days and 40 nights (Genesis 7:12)." },
  { id: "t19", question: "Who was thrown into a den of lions?", options: ["Daniel", "Shadrach", "Meshach", "Abednego"], answer: "Daniel", explanation: "Daniel was protected by God in the lions' den (Daniel 6)." },
  { id: "t20", question: "What did God use to create Eve?", options: ["Dust", "A rib from Adam", "A flower", "His word alone"], answer: "A rib from Adam", explanation: "God made Eve from one of Adam's ribs (Genesis 2:22)." },
  { id: "t21", question: "Which prophet was swallowed by a great fish?", options: ["Elijah", "Elisha", "Jonah", "Amos"], answer: "Jonah", explanation: "Jonah spent three days in the belly of the fish (Jonah 1)." },
  { id: "t22", question: "What was the occupation of Peter before becoming a disciple?", options: ["Tax collector", "Fisherman", "Carpenter", "Tentmaker"], answer: "Fisherman", explanation: "Peter and Andrew were fishermen (Matthew 4:18)." },
  { id: "t23", question: "Who received the coat of many colors?", options: ["Joseph", "Benjamin", "Reuben", "Judah"], answer: "Joseph", explanation: "Jacob loved Joseph more and gave him the coat (Genesis 37)." },
  { id: "t24", question: "How many tribes of Israel were there?", options: ["3", "7", "10", "12"], answer: "12", explanation: "There were 12 tribes named after the sons of Jacob." },
  { id: "t25", question: "Who wrote the majority of the Psalms?", options: ["Solomon", "David", "Moses", "Asaph"], answer: "David", explanation: "King David is the primary author of the Psalms." }
];

const SCRAMBLE: ScrambleWord[] = [
  { id: "s1", scrambled: "EIDCEBONE", original: "OBEDIENCE", hint: "Better than sacrifice." },
  { id: "s2", scrambled: "ETRUDTIGA", original: "GRATITUDE", hint: "A thankful heart." },
  { id: "s3", scrambled: "ENCEILISRE", original: "RESILIENCE", hint: "The ability to bounce back." },
  { id: "s4", scrambled: "HASSADAH", original: "HADDASSAH", hint: "Your royal name." },
  { id: "s5", scrambled: "VEREPANCEERS", original: "PERSEVERANCE", hint: "Staying the course." },
  { id: "s6", scrambled: "HIFUTFALSSEN", original: "FAITHFULNESS", hint: "Great is Thy..." },
  { id: "s7", scrambled: "RECOMPASSION", original: "COMPASSION", hint: "Jesus was moved with this." },
  { id: "s8", scrambled: "DOWISM", original: "WISDOM", hint: "More precious than rubies." },
  { id: "s9", scrambled: "GTEOHUSRENSIS", original: "RIGHTEOUSNESS", hint: "The breastplate of..." },
  { id: "s10", scrambled: "LREVEAOTIN", original: "REVELATION", hint: "The final book." },
  { id: "s11", scrambled: "SSTTEFADANE", original: "STEADFAST", hint: "Firm and unwavering." },
  { id: "s12", scrambled: "GENCOURLY", original: "GENEROUSLY", hint: "God gives wisdom this way." },
  { id: "s13", scrambled: "HTIAF", original: "FAITH", hint: "The substance of things hoped for." },
  { id: "s14", scrambled: "RVEIEDEM", original: "REDEEMER", hint: "I know that my ___ lives." },
  { id: "s15", scrambled: "YCITNASUT", original: "SANCTUARY", hint: "A holy place." },
  { id: "s16", scrambled: "CVIORYT", original: "VICTORY", hint: "Thanks be to God who gives us the ___." },
  { id: "s17", scrambled: "EVOCNAN", original: "COVENANT", hint: "A sacred agreement or promise." },
  { id: "s18", scrambled: "YOLAL", original: "LOYAL", hint: "Ruth was this to Naomi." },
  { id: "s19", scrambled: "EPACE", original: "PEACE", hint: "My ___ I give to you." },
  { id: "s20", scrambled: "SREMYC", original: "MERCY", hint: "His ___ endures forever." },
  { id: "s21", scrambled: "LREVOE", original: "LOVE", hint: "The greatest of these is ___." },
  { id: "s22", scrambled: "HITEGUSROU", original: "RIGHTEOUS", hint: "The prayer of a ___ man avails much." },
  { id: "s23", scrambled: "LREVOYRE", original: "GLORY", hint: "The heavens declare the ___ of God." },
  { id: "s24", scrambled: "RELPUP", original: "PURPLE", hint: "The color of royalty." },
  { id: "s25", scrambled: "YIIGNTD", original: "DIGNITY", hint: "She is clothed with strength and ___." }
];

const WHO_AM_I: WhoAmI[] = [
  { id: "w1", riddle: "I was not a queen by birth, but I saved my people from a sentence of death. Who am I?", answer: "Esther", hint: "Think of the scroll read during Purim." },
  { id: "w2", riddle: "I followed my mother-in-law to a land not my own, and found a redeemer in the fields. Who am I?", answer: "Ruth", hint: "Where you go, I will go." },
  { id: "w3", riddle: "I was a shepherd boy who became a king after defeating a giant. Who am I?", answer: "David", hint: "I played the harp for Saul." },
  { id: "w4", riddle: "I was swallowed by a great fish when I tried to run away from God's call to Nineveh. Who am I?", answer: "Jonah", hint: "I spent three days in the deep." },
  { id: "w5", riddle: "I was a tax collector who climbed a sycamore tree to see Jesus. Who am I?", answer: "Zacchaeus", hint: "I was a wee little man." },
  { id: "w6", riddle: "I am the mother of John the Baptist and was once called barren. Who am I?", answer: "Elizabeth", hint: "Mary's relative." },
  { id: "w7", riddle: "I was a tentmaker who traveled with Paul. Who am I?", answer: "Priscilla", hint: "Wife of Aquila." },
  { id: "w8", riddle: "I am the shortest book in the Old Testament. What am I?", answer: "Obadiah", hint: "Only one chapter." },
  { id: "w9", riddle: "I am the prophet who was taken to heaven in a whirlwind. Who am I?", answer: "Elijah", hint: "I left my cloak for Elisha." },
  { id: "w10", riddle: "I was the first woman created. Who am I?", answer: "Eve", hint: "Mother of all living." },
  { id: "w11", riddle: "I am the disciple who doubted Jesus' resurrection until I saw Him. Who am I?", answer: "Thomas", hint: "I am often called 'Doubting'." },
  { id: "w12", riddle: "I was the brother of Moses and the first high priest. Who am I?", answer: "Aaron", hint: "I spoke for my brother." },
  { id: "w13", riddle: "I am the strongest man who ever lived, but my hair was my secret. Who am I?", answer: "Samson", hint: "Watch out for Delilah." },
  { id: "w14", riddle: "I built an ark to save my family from the flood. Who am I?", answer: "Noah", hint: "I used gopher wood." },
  { id: "w15", riddle: "I am the man after God's own heart. Who am I?", answer: "David", hint: "I wrote many Psalms." },
  { id: "w16", riddle: "I am the wisest king who ever lived. Who am I?", answer: "Solomon", hint: "I built the Temple." },
  { id: "w17", riddle: "I was sold into slavery by my brothers and became second only to Pharaoh. Who am I?", answer: "Joseph", hint: "I have a coat of many colors." },
  { id: "w18", riddle: "I am the mother of Jesus. Who am I?", answer: "Mary", hint: "Blessed among women." },
  { id: "w19", riddle: "I led the Israelites out of Egypt. Who am I?", answer: "Moses", hint: "I held the staff that parted the sea." },
  { id: "w20", riddle: "I am the first martyr of the church. Who am I?", answer: "Stephen", hint: "I saw heaven opened." }
];

export default function BiblicalGames() {
  const { syncData } = useSupabase();
  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [shuffledData, setShuffledData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const completedIds = useLiveQuery(() => db.gameProgress.toArray())?.map(p => p.itemId) || [];
  const level = Math.floor(completedIds.length / 5) + 1;
  const progressToNextLevel = (completedIds.length % 5) / 5 * 100;

  const shuffle = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setInput('');
    setStatus('idle');
    setShowHint(false);
  };

  const handleModeSelect = async (m: GameMode) => {
    if (m === 'selig-spark') {
      setIsLoading(true);
      setMode(m);
      try {
        const response = await fetch('/api/selig', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: `ACT AS SELIG. Generate a truly OBSCURE, RARE, and UNIQUE Bible Trivia question for Hadassah. 
            DO NOT ask about Noah, David, or Esther. Think about minor characters, specific numbers, or hidden details in the prophets or genealogies. 
            RANDOM SEED: ${Math.random()}. 
            Return ONLY a JSON object with keys: 'question', 'options' (4 unique choices), 'answer' (exact match), 'explanation' (the fascinating context).`,
          })
        });
        const data = await response.json();
        
        // Validation check to ensure data is shaped correctly
        if (data.question && data.options && data.answer) {
          setShuffledData([{ ...data, id: `spark-${Date.now()}` }]);
        } else {
          // Fallback if AI output is messy
          setShuffledData([TRIVIA[Math.floor(Math.random() * TRIVIA.length)]]);
        }
      } catch (e) {
        console.error("Spark failed:", e);
        setMode(null);
      } finally {
        setIsLoading(false);
      }
      resetGame();
      return;
    }

    const fullData = m === 'trivia' ? TRIVIA : m === 'scramble' ? SCRAMBLE : WHO_AM_I;
    // ONLY show items she HAS NOT completed yet
    let unseenData = fullData.filter(item => !completedIds.includes(item.id));
    
    if (unseenData.length === 0) {
      // If she finished all, show a mix of old ones to keep it fresh
      setShuffledData(shuffle(fullData).slice(0, 5));
    } else {
      // Show up to 5 unseen ones per session
      setShuffledData(shuffle(unseenData).slice(0, 5));
    }
    
    setMode(m);
    resetGame();
  };

  const checkAnswer = async (selected?: string) => {
    let isCorrect = false;
    const current = shuffledData[currentIndex];
    const answerId = current.id || `spark-${current.question.substring(0, 20)}`;
    
    if (mode === 'trivia' || mode === 'selig-spark') {
      isCorrect = selected === current.answer;
    } else if (mode === 'scramble') {
      isCorrect = input.toUpperCase().trim() === current.original;
    } else if (mode === 'whoami') {
      isCorrect = input.toLowerCase().trim() === current.answer.toLowerCase();
    }

    if (isCorrect) {
      setScore(s => s + 1);
      setStatus('correct');
      // SAVE PROGRESS: Mark as completed so it doesn't show up again
      await db.gameProgress.add({
        gameType: mode as string,
        itemId: answerId,
        completedAt: new Date()
      });
      syncData();
    } else {
      setStatus('wrong');
    }

    setTimeout(() => {
      if (currentIndex < shuffledData.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setInput('');
        setStatus('idle');
        setShowHint(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 pb-32">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-amber-500/10 rounded-3xl mb-4 border border-amber-500/20">
          <Brain size={40} className="text-amber-600" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic text-zinc-800 handwritten">Bible Game Center</h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-amber-600">Progressing through the Word, Hadassah</p>
        
        {/* Level and Progress Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Level {level}</span>
            <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest">{completedIds.length} Total Correct</span>
          </div>
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden border border-black/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              className="h-full bg-amber-500"
            />
          </div>
        </div>
      </div>

      {!mode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GameModeCard 
            title="Bible Trivia" 
            desc="Unseen questions from the Word" 
            icon={<HelpCircle className="text-sky-500" />} 
            onClick={() => handleModeSelect('trivia')} 
          />
          <GameModeCard 
            title="Word Scramble" 
            desc="New royal vocabulary" 
            icon={<Search className="text-purple-500" />} 
            onClick={() => handleModeSelect('scramble')} 
          />
          <GameModeCard 
            title="Who Am I?" 
            desc="Identify Biblical heroes" 
            icon={<Sparkles className="text-rose-500" />} 
            onClick={() => handleModeSelect('whoami')} 
          />
          <GameModeCard 
            title="Selig's Spark" 
            desc={level < 2 ? "Unlocks at Level 2" : "AI-generated unique challenges"} 
            icon={<Stars className={level < 2 ? "text-zinc-300" : "text-amber-500"} />} 
            onClick={() => level >= 2 && handleModeSelect('selig-spark')} 
            disabled={level < 2}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setMode(null)}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={12} /> Back to Menu
          </button>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="text-amber-500 animate-spin" size={40} />
                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest italic">Selig is searching the scriptures for you...</p>
              </motion.div>
            ) : showResult ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-12 text-center border border-black/5 shadow-xl"
              >
                <div className="inline-block p-6 bg-amber-500/20 rounded-full text-amber-600 mb-6">
                  <Trophy size={48} />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-800 mb-2">Well Done!</h3>
                <p className="text-zinc-500 text-sm mb-8">You scored <span className="text-amber-600 font-bold">{score}</span> out of {shuffledData.length}</p>
                <button 
                  onClick={resetGame}
                  className="px-10 py-4 bg-zinc-900 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                >
                  Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full">
                    {mode === 'selig-spark' ? 'Selig Spark' : `Challenge ${currentIndex + 1}`}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Score: {score}
                  </span>
                </div>

                {mode === 'selig-spark' && (
                  <div className="space-y-8">
                    <div className="relative p-8 bg-[#fdf6e3] rounded-sm border-x-8 border-[#d4af37] shadow-inner" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/parchment.png")` }}>
                       <p className="text-xl md:text-2xl font-serif italic text-[#5d2e0a] leading-relaxed text-center">
                        &quot;{shuffledData[currentIndex]?.question}&quot;
                      </p>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Solve the mystery..."
                        className="w-full bg-white/50 border-2 border-amber-200 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-800 placeholder:text-zinc-300"
                        onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && checkAnswer()}
                      />
                      {status !== 'idle' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {status === 'correct' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-4">
                      {showHint ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm italic text-amber-700">
                          {shuffledData[currentIndex]?.explanation.split('.')[0]}...
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => setShowHint(true)}
                          className="text-[10px] font-black uppercase tracking-widest text-amber-600/60 hover:text-amber-600 transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Sparkles size={12} /> Ask Selig for a Clue
                        </button>
                      )}
                    </div>

                    {status === 'correct' && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">The Revelation</p>
                        <p className="text-sm font-medium text-emerald-800 leading-relaxed italic">
                          {shuffledData[currentIndex]?.explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {mode === 'trivia' && (
                  <div className="space-y-8">
                    <p className="text-2xl font-serif italic text-zinc-800 leading-relaxed text-center">
                      {shuffledData[currentIndex]?.question}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {shuffledData[currentIndex]?.options?.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => status === 'idle' && checkAnswer(opt)}
                          className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-medium ${
                            status === 'idle' 
                              ? 'border-black/5 hover:border-amber-500/30 hover:bg-amber-50/50' 
                              : opt === shuffledData[currentIndex].answer
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {status !== 'idle' && shuffledData[currentIndex]?.explanation && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs italic text-zinc-500 bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-center">
                        {shuffledData[currentIndex].explanation}
                      </motion.p>
                    )}
                  </div>
                )}

                {mode === 'scramble' && (
                  <div className="space-y-8 text-center">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Unscramble this word</p>
                      <h3 className="text-5xl font-black italic tracking-tighter text-amber-600 uppercase">
                        {shuffledData[currentIndex]?.scrambled}
                      </h3>
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type the word..."
                        className="w-full bg-white/50 border border-zinc-200 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-800"
                        onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && checkAnswer()}
                      />
                      {status !== 'idle' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {status === 'correct' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                        </div>
                      )}
                    </div>
                    <p className="text-sm italic text-zinc-500">Hint: {shuffledData[currentIndex]?.hint}</p>
                  </div>
                )}

                {mode === 'whoami' && (
                  <div className="space-y-8">
                    <p className="text-2xl font-serif italic text-zinc-800 leading-relaxed text-center">
                      &quot;{shuffledData[currentIndex]?.riddle}&quot;
                    </p>
                    <div className="relative">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Who am I?"
                        className="w-full bg-white/50 border border-zinc-200 rounded-2xl px-6 py-4 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-800"
                        onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && checkAnswer()}
                      />
                      {status !== 'idle' && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {status === 'correct' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      {showHint ? (
                        <p className="text-sm italic text-amber-600 bg-amber-50 py-3 rounded-xl border border-amber-100 px-4">
                          {shuffledData[currentIndex]?.hint}
                        </p>
                      ) : (
                        <button 
                          onClick={() => setShowHint(true)}
                          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-amber-600 transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Lightbulb size={12} /> Need a hint?
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {status === 'wrong' && mode !== 'trivia' && mode !== 'selig-spark' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-xs text-red-500 font-bold uppercase tracking-widest">
                    Try again, mi hermana
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function GameModeCard({ title, desc, icon, onClick, disabled }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`group bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-black/5 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all text-left flex flex-col gap-4 relative overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zinc-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
      <div className={`p-3 bg-white rounded-2xl shadow-sm w-fit relative z-10 ${disabled ? 'bg-zinc-50' : ''}`}>
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-800">{title}</h3>
        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed mt-1">{desc}</p>
      </div>
      {!disabled && (
        <div className="mt-4 flex items-center text-zinc-900 font-black uppercase text-[8px] tracking-[0.3em] relative z-10">
          Play Now <ChevronRight size={10} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </button>
  );
}
