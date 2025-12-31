
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Sun, CloudRain, BookOpen, Star, Home, Volume2, VolumeX, Check, X, ArrowRight, Umbrella, Wand2, Droplets, Cloud, Square, Loader2, Glasses } from 'lucide-react';
import './App.css'
import './index.css'
// --- 全局数据常量 (保持不变) ---
const QUIZ_DATA = [
    {"id": 'ant', "behavior": '搬家去高处', "question": "看到 🐜 蚂蚁搬家，说明天气？", "options": [{"id": 'sun', "text": '晴天', "isCorrect": false}, {"id": 'rain', "text": '下雨', "isCorrect": true}], "feedback": {"correct": "答对啦！蚂蚁怕水淹，所以下雨前会搬家。", "incorrect": "不对哦，蚂蚁搬家是为了躲雨。"}, "soundEffect": 'rain'},
    {"id": 'spider', "behavior": '努力结网', "question": "发现 🕷️ 蜘蛛结网，说明天气？", "options": [{"id": 'sun', "text": '变好', "isCorrect": true}, {"id": 'rain', "text": '变坏', "isCorrect": false}], "feedback": {"correct": "真棒！蜘蛛只在好天气才出来工作。", "incorrect": "猜错啦，蜘蛛怕雨水打破网。"}, "soundEffect": 'cicada'},
    {"id": 'bird', "behavior": '低空飞行', "question": "看到 🐦 燕子低飞，要带什么？", "options": [{"id": 'sun', "text": '墨镜', "isCorrect": false}, {"id": 'rain', "text": '雨伞', "isCorrect": true}], "feedback": {"correct": "正确！空气湿润虫子飞不高，燕子也飞得低。", "incorrect": "不对哦，燕子低飞是因为快下雨了。"}, "soundEffect": 'rain'},
    {"id": 'dragonfly', "behavior": '低飞捉虫子', "question": "如果 🚁 蜻蜓飞得很低，预示着？", "options": [{"id": 'sun', "text": '大太阳', "isCorrect": false}, {"id": 'rain', "text": '要下雨', "isCorrect": true}], "feedback": {"correct": "太聪明了！蜻蜓低飞和燕子一样，都是因为空气潮湿。", "incorrect": "不对哦，蜻蜓低飞说明空气湿气重，要下雨啦。"}, "soundEffect": 'rain'},
    {"id": 'frog', "behavior": '大声呱呱叫', "question": "听见 🐸 青蛙大声叫，会发生？", "options": [{"id": 'rain', "text": '下雨', "isCorrect": true}, {"id": 'sun', "text": '天晴', 'isCorrect': false}], "feedback": {"correct": "答对了！青蛙在呼吸潮湿空气时叫得最欢。", "incorrect": "猜错了，青蛙大叫通常预示着要下雨。"}, "soundEffect": 'frog'},
    {"id": 'fish', "behavior": '跳出水面', "question": "看到 🐟 小鱼跳出水面，是因为？", "options": [{"id": 'rain', "text": '快下雨', "isCorrect": true}, {"id": 'sun', "text": '晒太阳', "isCorrect": false}], "feedback": {"correct": "真棒！水里闷热缺氧，小鱼才跳出来透透气。", "incorrect": "不对哦，下雨前气压低，水里氧气少，小鱼才跳出来的。"}, "soundEffect": 'splash'},
    {"id": 'turtle', "behavior": '背上湿漉漉', "question": "发现 🐢 乌龟背上湿湿的，说明？", "options": [{"id": 'rain', "text": '潮湿下雨', "isCorrect": true}, {"id": 'sun', "text": '太热了', "isCorrect": false}], "feedback": {"correct": "观察真仔细！这是因为空气湿度大，要下雨了。", "incorrect": "不对哦，这叫“乌龟冒汗”，说明要下雨啦。"}, "soundEffect": 'rain'},
    {"id": 'bee', "behavior": '不出窝', "question": "如果 🐝 蜜蜂都不出窝，说明？", "options": [{"id": 'rain', "text": '有雨', "isCorrect": true}, {"id": 'sun', "text": '偷懒', "isCorrect": false}], "feedback": {"correct": "答对了！蜜蜂对天气很敏感，下雨前不出门。", "incorrect": "哈哈不对哦，蜜蜂很勤劳的，不出门是因为怕下雨。"}, "soundEffect": 'rain'},
    {"id": 'cicada', "behavior": '拼命叫', "question": "听见 🦗 知了拼命叫，天气是？", "options": [{"id": 'rain', "text": '阴雨', "isCorrect": false}, {"id": 'sun', "text": '晴朗', "isCorrect": true}], "feedback": {"correct": "完全正确！知了怕冷怕雨，大太阳才叫得欢。", "incorrect": "猜错啦，知了叫得欢，说明天气很热很晴朗。"}, "soundEffect": 'cicada'}
];

const ANIMALS_GRID = [
    {"id": 'ant', "icon": '🐜', "color": 'bg-amber-100', "text": 'text-amber-700', "name": '蚂蚁'},
    {"id": 'spider', "icon": '🕷️', "color": 'bg-purple-100', "text": 'text-purple-700', "name": '蜘蛛'},
    {"id": 'bird', "icon": '🐦', "color": 'bg-sky-100', "text": 'text-sky-700', "name": '燕子'},
    {"id": 'dragonfly', "icon": '🚁', "color": 'bg-teal-100', "text": 'text-teal-700', "name": '蜻蜓'},
    {"id": 'frog', "icon": '🐸', "color": 'bg-green-100', "text": 'text-green-700', "name": '青蛙'},
    {"id": 'fish', "icon": '🐟', "color": 'bg-blue-100', "text": 'text-blue-700', "name": '小鱼'},
    {"id": 'turtle', "icon": '🐢', "color": 'bg-orange-100', "text": 'text-orange-700', "name": '乌龟'},
    {"id": 'bee', "icon": '🐝', "color": 'bg-yellow-100', "text": 'text-yellow-700', "name": '蜜蜂'},
    {"id": 'cicada', "icon": '🦗', "color": 'bg-lime-100', "text": 'text-lime-700', "name": '知了'},
];

const MAX_RETRIES = 1;

// 在前端定义一个简单的缓存对象
const audioCache = new Map<string, string>();

// --- Web Audio & TTS Logic ---
const useAudioAndSpeech = (isMuted: boolean) => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const currentAudioSource = useRef<AudioBufferSourceNode | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isGeminiTtsSpeaking, setIsGeminiTtsSpeaking] = useState(false);

    const currentAudio = useRef<HTMLAudioElement | null>(null);


    // 客户端才初始化 AudioContext
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }, []);

    const stopSpeech = useCallback(() => {
        if (typeof window === 'undefined') return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        if (currentAudioSource.current) {
            try {
                currentAudioSource.current.stop();
            } catch (e) { }
            currentAudioSource.current = null;
        }
        if (currentAudio.current) {
            currentAudio.current.pause();
            currentAudio.current.currentTime = 0;
        }
        setIsSpeaking(false);
    }, []);

    const playTone = useCallback((freq: number, type: OscillatorType, duration: number, volume = 0.1) => {
        if (isMuted || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }, [isMuted]);

    const playSuccessSound = useCallback(() => {
        playTone(523.25, 'sine', 0.1); 
        setTimeout(() => playTone(659.25, 'sine', 0.1), 100); 
        setTimeout(() => playTone(783.99, 'sine', 0.2), 200); 
        setTimeout(() => playTone(1046.50, 'sine', 0.4), 300); 
    }, [playTone]);

    const playErrorSound = useCallback(() => {
        playTone(150, 'sawtooth', 0.3);
        setTimeout(() => playTone(100, 'sawtooth', 0.3), 200);
    }, [playTone]);

    const playCroakSound = useCallback(() => {
        playTone(100, 'square', 0.1);
        setTimeout(() => playTone(80, 'square', 0.1), 100);
    }, [playTone]);

    const playBuzzSound = useCallback(() => {
        playTone(200, 'sawtooth', 0.3, 0.05);
    }, [playTone]);

    const playNoiseSound = useCallback((type = 'rain') => {
        if (isMuted || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const duration = type === 'splash' ? 0.3 : 1.0;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        if (type === 'splash') {
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
        } else {
            filter.type = 'lowpass';
            filter.frequency.value = 800; 
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
        }
        
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    }, [isMuted]);

    const playHighPitchSound = useCallback((type = 'bird') => {
        if (isMuted || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        if (type === 'cicada') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(4000, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            const lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 50; 
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 500;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
            lfo.stop(ctx.currentTime + 0.5);
        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.1);
            osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
        }
        
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (type === 'cicada' ? 0.5 : 0.2));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (type === 'cicada' ? 0.5 : 0.2));
    }, [isMuted]);

    // 2. 播放语音的调用
    const handlePlayAudio = async (text: string) => {
        const response = await fetch('http://192.168.1.103:5000/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        return response;

    };
    
    // --- Advanced TTS with Gemini ---
    const speak = useCallback(async (text: string) => {
        if (isMuted) return;
        stopSpeech(); 
        setIsSpeaking(true);

        try {
            for (let i = 0; i < MAX_RETRIES; i++) {
                try {
                    const response = await handlePlayAudio(text);
                    if (response.ok) {
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);
                        currentAudio.current = new Audio(url);
                        await currentAudio.current.play();
                        currentAudio.current.onended = () => setIsSpeaking(false);  
                        return; // Success
                    } else{
                        const err = await response.json();
                        console.error(`TTS API request failed: ${response.status} - ${err.error}`);
                        continue;
                    } 
                } catch (innerError) {
                    console.error(`TTS attempt ${i + 1} failed:`, innerError);
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        } catch (error) {
            console.warn("Retries failed, falling back to browser TTS:", error);
        }
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 1;
            utterance.pitch = 1.2;
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else {
            setIsSpeaking(false);
        }

    }, [isMuted, stopSpeech, setIsGeminiTtsSpeaking]);

    return { 
        playSuccessSound, playErrorSound, playNoiseSound, playHighPitchSound, playCroakSound, playBuzzSound, 
        speak, stopSpeech, isSpeaking, isGeminiTtsSpeaking 
    };
};

// --- App Component ---
const WeatherApp = () => {
    const [state, setState] = useState({
        screen: 'intro',
        activeCard: null as string | null,
        score: 0,
        isMuted: false,
        quizQuestions: [] as any[],
        currentQuestionIndex: 0,
        quizAnswered: false,
        selectedAnswer: null as string | null,
        selectedAnimals: [] as string[],
        generatedStory: null as string | null,
        isGenerating: false,
        isUseQwenStory: true,
    });
    
    const { 
        playSuccessSound, playErrorSound, playNoiseSound, playHighPitchSound, playCroakSound, playBuzzSound, 
        speak, stopSpeech, isSpeaking 
    } = useAudioAndSpeech(state.isMuted);

    // ... (Effect logic 保持不变) ...
    useEffect(() => {
        const handleActiveCardChange = () => {
            stopSpeech();
            if (state.isMuted) return;

            const id = state.activeCard;
            if (!id) return;
            
            const cardEffects: any = {
                ant: { sound: () => playNoiseSound('rain'), text: "空气变得湿润，蚂蚁要把家搬到高处去，不然会被雨水淹没。" },
                spider: { sound: () => { playHighPitchSound('bird'); setTimeout(() => playHighPitchSound('bird'), 500); }, text: "蜘蛛很聪明，只有在天气变好时才会出来织网捉虫子。" },
                bird: { sound: () => playNoiseSound('rain'), text: "快下雨时，空气湿湿的，虫子飞不高，燕子为了捉虫子也飞得很低。" },
                dragonfly: { sound: playBuzzSound, text: "蜻蜓飞得低，出门带雨衣。空气潮湿，翅膀变重啦。" },
                frog: { sound: () => { playCroakSound(); setTimeout(playCroakSound, 600); }, text: "呱呱呱！青蛙大声叫，大雨要来到。皮肤湿润它们最喜欢。" },
                fish: { sound: () => playNoiseSound('splash'), text: "要下雨了，水里氧气少，小鱼跳出水面来透透气。" },
                turtle: { sound: () => playNoiseSound('rain'), text: "乌龟背上冒汗了，说明空气很潮湿，马上要下雨啦。" },
                bee: { sound: playBuzzSound, text: "蜜蜂不出工，雨天在其中。怕雨水打湿翅膀飞不起来。" },
                cicada: { sound: () => playHighPitchSound('cicada'), text: "知了拼命叫，天气热又燥。说明今天是个大晴天！" },
            };

            if (cardEffects[id]) {
                cardEffects[id].sound();
                setTimeout(() => speak(cardEffects[id].text), 100);
            }
        };

        if (state.screen === 'learn' && state.activeCard) {
            handleActiveCardChange();
        } else if (state.screen !== 'story_generator') {
             stopSpeech();
        }
    }, [state.activeCard, state.isMuted, state.screen, playNoiseSound, playHighPitchSound, playCroakSound, playBuzzSound, speak, stopSpeech]);

    // ✅ [新增] 监听证书页面，如果是满分，播放恭喜语音
    useEffect(() => {
        if (state.screen === 'certificate') {
            const isFullScore = state.score === state.quizQuestions.length;

            // 设置一个小延迟，让界面先渲染出来，体验更自然
            const timer = setTimeout(() => {
                {isFullScore ? speak('恭喜小朋友，你认识了所有的小动物气象员，真是个博学的小专家！') : speak('小朋友，再接再厉，继续努力！')};
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [state.screen, state.score, state.quizQuestions.length, speak]);

    // ✅ [新增] 监听题目切换，朗读题目内容
    useEffect(() => {
        // 只有在 'quiz' 界面，且当前题目处于“未回答”状态时才朗读
        // 这样可以避免用户答题后（显示结果时）重复朗读题目
        if (state.screen === 'quiz' && !state.quizAnswered) {
            const currentQ = state.quizQuestions[state.currentQuestionIndex];
            if (currentQ) {
                // 正则表达式：匹配所有在 QUIZ_DATA 中用到的 Emoji
                // 🐜 蚂蚁, 🕷️ 蜘蛛, 🐦 燕子, 🚁 蜻蜓, 🐸 青蛙, 🐟 小鱼, 🐢 乌龟, 🐝 蜜蜂, 🦗 知了
                const cleanQuestion = currentQ.question.replace(/[🐜🕷️🐦🚁🐸🐟🐢🐝🦗]/g, '');
                // 延迟 500ms 播放，等待界面动画完成，体验更流畅
                const timer = setTimeout(() => {
                    speak(cleanQuestion);
                }, 100);
                return () => clearTimeout(timer);
            }
        }
    }, [state.screen, state.currentQuestionIndex, state.quizAnswered, state.quizQuestions, speak]);

    const updateState = useCallback((newStateOrFn: any) => {
        setState(prevState => {
            const newState = typeof newStateOrFn === 'function' ? newStateOrFn(prevState) : newStateOrFn;
            return { ...prevState, ...newState };
        });
    }, []);

    // ... (Navigation Handlers 保持不变) ...
    const handleGoHome = useCallback(() => { stopSpeech(); updateState({ screen: 'intro', activeCard: null }); }, [updateState, stopSpeech]);
    const handleStartLearn = useCallback(() => { if (!state.isMuted) playSuccessSound(); updateState({ screen: 'learn', activeCard: null }); }, [updateState, state.isMuted, playSuccessSound]);
    const handleStartStoryGenerator = useCallback(() => { updateState({ screen: 'story_generator', generatedStory: null }); }, [updateState]);
    const handleToggleMute = useCallback(() => { stopSpeech(); updateState({ isMuted: !state.isMuted }); }, [updateState, state.isMuted, stopSpeech]);
    const handleStartQuiz = useCallback(() => {
        stopSpeech();
        if (!state.isMuted) playHighPitchSound('bird');
        const shuffled = [...QUIZ_DATA].sort(() => 0.5 - Math.random());
        updateState({ quizQuestions: shuffled.slice(0, 5), currentQuestionIndex: 0, quizAnswered: false, selectedAnswer: null, score: 0, screen: 'quiz' });
    }, [updateState, state.isMuted, playHighPitchSound, stopSpeech]);

    // ... (Quiz Logic 保持不变) ...
    const handleQuizAnswer = useCallback((answerId: string, isCorrect: boolean) => {
        if (state.quizAnswered) return;
        let newScore = state.score;
        const currentQuestion = state.quizQuestions[state.currentQuestionIndex];
        if (isCorrect) {
          newScore += 1;
          if (!state.isMuted) { playSuccessSound(); speak(currentQuestion.feedback.correct); }
        } else {
          if (!state.isMuted) { playErrorSound(); speak(currentQuestion.feedback.incorrect); }
        }
        updateState({ selectedAnswer: answerId, quizAnswered: true, score: newScore });
    }, [state.quizAnswered, state.score, state.quizQuestions, state.currentQuestionIndex, state.isMuted, playSuccessSound, playErrorSound, speak, updateState]);

    const handleNextQuestion = useCallback(() => {
        stopSpeech();
        if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
          updateState({ currentQuestionIndex: state.currentQuestionIndex + 1, quizAnswered: false, selectedAnswer: null });
        } else {
          updateState({ screen: 'certificate' });
        }
    }, [state.currentQuestionIndex, state.quizQuestions.length, updateState, stopSpeech]);
    
    const handleLearnCardClick = useCallback((id: string) => {
        const newActiveCard = state.activeCard === id ? null : id;
        if (newActiveCard === null) stopSpeech();
        updateState({ activeCard: newActiveCard });
    }, [state.activeCard, updateState, stopSpeech]);

    const handleToggleAnimalSelection = useCallback((id: string) => {
        updateState((prevState: any) => {
            const newSelectedAnimals = [...prevState.selectedAnimals];
            const isSelected = newSelectedAnimals.includes(id);
            if (isSelected) {
                return { selectedAnimals: newSelectedAnimals.filter(a => a !== id), generatedStory: null };
            } else if (newSelectedAnimals.length < 3) { 
                return { selectedAnimals: [...newSelectedAnimals, id], generatedStory: null };
            }
            return prevState; 
        });
    }, [updateState]);

    // 1. 生成故事的调用
    const handleGenerateStory = async (details: string) => {
        const response = await fetch('http://192.168.1.103:5000/api/story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animalDetails: details }),
        });
        return response;

    };

    

    // [修改点] 生成故事 Logic: 调用 /api/story
    const generateStory = useCallback(async () => {
        if (state.selectedAnimals.length === 0) return;
        
        updateState({ isGenerating: true, generatedStory: null });
        stopSpeech();

        const selectedAnimalsDetails = state.selectedAnimals.map(id => {
            const animal = ANIMALS_GRID.find(a => a.id === id);
            const quizItem = QUIZ_DATA.find(q => q.id === id);
            const behavior = quizItem ? quizItem.behavior : animal?.name; 
            const correctOption = quizItem?.options.find(o => o.isCorrect);
            const result = correctOption ? correctOption.text : '未知';
            return `${animal?.name}: ${behavior} -> 预报 ${result}`;
        }).join('；');

        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                
                // 调用后端
                const response = await handleGenerateStory(selectedAnimalsDetails);

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                const text = result.text || "抱歉，没能成功生成故事。请再试一次！";
                
                updateState({ generatedStory: text, isGenerating: false });
                return;
                
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === MAX_RETRIES - 1) {
                    updateState({ generatedStory: "故事生成失败，网络连接或API请求出错。", isGenerating: false });
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }, [state.selectedAnimals, updateState, stopSpeech, state.isUseQwenStory]);


    // --- UI Components (Helper) ---
    // 为了节省篇幅，这里将所有 UI 子组件（Animation, Intro, Learn等）的 JSX 逻辑都合并在这个主返回中。
    // 在实际项目中，建议将这些拆分为单独的文件。

    const AnimalAnimation = ({ id }: {id: string}) => {
        const animalData = useMemo(() => {
            switch (id) {
                case 'ant': return { animationClass: 'animate-[pulse_1s_infinite] ant-animation', icon: '🐜', description: '搬家去高处', bgColor: 'bg-amber-100', textColor: 'text-amber-800' };
                case 'spider': return { animationClass: 'animate-[spin_10s_linear_infinite] spider-animation', icon: '🕸️', description: '结网捕猎', bgColor: 'bg-slate-800', textColor: 'text-gray-400' };
                case 'bird': return { animationClass: 'animate-[fly-low_2s_infinite_alternate] bird-animation', icon: '🐦', description: '低空飞行', bgColor: 'bg-sky-200', textColor: 'text-sky-800' };
                case 'dragonfly': return { animationClass: 'animate-[darting_2s_infinite_alternate] dragonfly-animation', icon: '🚁', description: '低飞捉虫子', bgColor: 'bg-teal-100', textColor: 'text-teal-800' };
                case 'frog': return { animationClass: 'animate-[croak_1s_ease-in-out_infinite] frog-animation', icon: '🐸', description: '大声呱呱叫', bgColor: 'bg-green-100', textColor: 'text-green-800' };
                case 'fish': return { animationClass: 'animate-[jump_1.5s_infinite_alternate] fish-animation', icon: '🐟', description: '跳出水面', bgColor: 'bg-blue-200', textColor: 'text-blue-800' };
                case 'turtle': return { animationClass: 'animate-[sweat_2s_linear_infinite] turtle-animation', icon: '🐢', description: '背上湿漉漉', bgColor: 'bg-orange-50', textColor: 'text-orange-800' };
                case 'bee': return { animationClass: 'animate-[return-home_1.5s_infinite_alternate] bee-animation', icon: '🐝', description: '匆忙回家', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800' };
                case 'cicada': return { animationClass: 'animate-[shake_0.1s_linear_infinite] cicada-animation', icon: '🦗', description: '大声唱歌', bgColor: 'bg-lime-100', textColor: 'text-lime-900' };
                default: return { animationClass: '', icon: '', description: '', bgColor: '', textColor: '' };
            }
        }, [id]);
        const isRain = id !== 'spider' && id !== 'cicada';
        const IconRainOrSun = isRain ? CloudRain : Sun;
        const colorRainOrSun = isRain ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600';
        const textRainOrSun = isRain ? '说明要下雨！' : '说明是晴天！';
        const turtleSweat = id === 'turtle' ? <Droplets className="w-4 h-4 text-blue-500 absolute -top-1 -right-1 fill-current" /> : null;
        return (
            <div className="animate-fade-in">
                <div className={`relative h-24 w-full overflow-hidden ${animalData.bgColor} rounded-lg border-b-4 border-gray-200 mt-4 flex items-center justify-center`}>
                    <div className={`text-4xl relative ${id === 'spider' ? 'text-gray-400' : ''} ${animalData.animationClass}`}>{animalData.icon}{turtleSweat}</div>
                    <div className={`absolute top-2 left-2 text-xs ${animalData.textColor} font-bold opacity-50`}>{animalData.description}</div>
                </div>
                <div className={`mt-3 flex items-center gap-2 font-bold justify-center py-2 rounded-lg text-sm ${colorRainOrSun}`}><IconRainOrSun className="w-4 h-4" />{textRainOrSun}</div>
            </div>
        );
    };

    const IntroScreen = () => (
        <div className="relative z-10 flex flex-col items-center pt-0 pb-10 px-0 text-center h-full">
            <div className="animate-bounce-slow mb-2 bg-yellow-300 p-3 rounded-full shadow-lg border-4 border-white"><Sun className="w-12 h-12 text-orange-500" /></div>
            <h1 className="text-2xl font-extrabold text-sky-600 mb-1 tracking-wider">我是小小气象员</h1>
            <p className="text-gray-500 text-sm mb-4">大自然有好多气象预报员，你认识几个？</p>
            <div className="grid grid-cols-3 gap-3 mb-6 w-full px-2">
                {ANIMALS_GRID.map(item => (<div key={item.id} className={`${item.color} p-2 rounded-xl flex flex-col items-center shadow-sm`}><span className="text-2xl mb-1">{item.icon}</span><span className={`text-xs ${item.text} font-bold`}>{item.name}</span></div>))}
            </div>
            <div className="w-full space-y-3 mt-auto mb-4 px-2">
                <button onClick={handleStartLearn} className="w-full bg-sky-500 hover:bg-sky-600 text-white text-xl font-bold py-3 rounded-full shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2">探索小动物 <BookOpen className="w-6 h-6 fill-current" /></button>
                <button onClick={handleStartStoryGenerator} className="w-full bg-orange-400 hover:bg-orange-500 text-white text-xl font-bold py-3 rounded-full shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"><span className="text-xl">✨</span> 气象故事生成器</button>
            </div>
        </div>
    );

    const LearnScreen = () => (
        <div className="relative z-10 flex flex-col h-full pt-0 pb-6 px-0">
            <h2 className="text-lg font-bold text-center text-sky-700 mb-4 bg-sky-100 inline-block py-2 px-4 rounded-full mx-auto">点击卡片听听它们说什么</h2>
            <div className="flex-1 overflow-y-auto pb-20 px-1">
                {QUIZ_DATA.map(item => {
                    const is_active = state.activeCard === item.id;
                    const animal = ANIMALS_GRID.find(a => a.id === item.id);
                    return (
                        <div key={item.id} onClick={() => handleLearnCardClick(item.id)} className={`learn-card bg-white rounded-2xl p-4 shadow-md border-2 transition-all cursor-pointer mb-4 ${is_active ? 'border-sky-400 ring-2 ring-sky-100' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2"><span className="bg-gray-100 p-2 rounded-lg text-xl">{animal?.icon}</span><h3 className="font-bold text-gray-700">{animal?.name}</h3></div>
                                <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${is_active ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'}`}>{is_active ? <Volume2 className="w-3 h-3" /> : '点击查看'}{is_active && ' 讲解中'}</div>
                            </div>
                            {is_active && <AnimalAnimation id={item.id} />}
                        </div>
                    );
                })}
            </div>
            <div className="absolute bottom-0 left-0 w-full px-6 bg-gradient-to-t from-white via-white to-transparent pt-6"><button onClick={handleStartQuiz} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">去考试 <Star className="w-5 h-5 fill-current" /></button></div>
        </div>
    );

    const QuizOption = ({ option }: {option: any}) => {
        const isSelected = state.selectedAnswer === option.id;
        const isCorrect = option.isCorrect;
        const QuizIcon = option.text.includes('墨镜') ? Glasses : (option.id.includes('sun') ? Sun : (option.text.includes('雨伞') ? Umbrella : CloudRain));
        const iconColor = option.id.includes('sun') ? 'text-orange-400' : 'text-blue-500';
        let buttonClass = 'border-gray-200 hover:border-sky-300 bg-gray-50';
        let FeedbackIcon = null;
        if (state.quizAnswered && isSelected) { buttonClass = isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'; FeedbackIcon = isCorrect ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />; }
        else if (state.quizAnswered && isCorrect) { buttonClass = 'bg-green-100 border-green-300 opacity-50'; }
        return (<button onClick={() => handleQuizAnswer(option.id, option.isCorrect)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${buttonClass}`} disabled={state.quizAnswered}><QuizIcon className={`w-8 h-8 ${iconColor}`} /><span className="font-bold text-gray-600">{option.text}</span>{FeedbackIcon}</button>);
    };

    const QuizScreen = () => {
        const q = state.quizQuestions[state.currentQuestionIndex];
        if (!q) return <div className="text-center mt-20 text-gray-500">加载题目中...</div>;
        const selectedOption = state.quizAnswered ? q.options.find((o: any) => o.id === state.selectedAnswer) : null;
        const isCorrect = selectedOption?.isCorrect;
        const feedback = isCorrect ? q.feedback.correct : q.feedback.incorrect;
        const feedbackClass = isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const questionHtml = q.question.replace('🐜', '<span class="text-amber-600 mx-1">🐜</span>').replace('🕷️', '<span class="text-purple-600 mx-1">🕷️</span>').replace('🐦', '<span class="text-blue-600 mx-1">🐦</span>').replace('🚁', '<span class="text-teal-600 mx-1">🚁</span>').replace('🐸', '<span class="text-green-600 mx-1">🐸</span>').replace('🐟', '<span class="text-blue-600 mx-1">🐟</span>').replace('🐢', '<span class="text-orange-600 mx-1">🐢</span>').replace('🐝', '<span class="text-yellow-600 mx-1">🐝</span>').replace('🦗', '<span class="text-lime-600 mx-1">🦗</span>');
        return (
            <div className="relative z-10 flex flex-col h-full pt-0 pb-6 px-0">
                <div className="flex items-center justify-between mb-6"><span className="bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full font-bold text-sm border border-yellow-200">小气象员考核</span><span className="text-sm text-sky-600 font-bold">第 {state.currentQuestionIndex + 1} / {state.quizQuestions.length} 题</span></div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-sky-100 mb-6 text-center flex-1 flex flex-col justify-center"><h3 className="text-lg font-bold text-gray-800 mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: questionHtml }} /><div className="grid grid-cols-2 gap-4">{q.options.map((option: any) => (<QuizOption key={option.id} option={option} />))}</div></div>
                {state.quizAnswered && (<div className="animate-fade-in-up text-center mt-auto"><div className={`p-3 rounded-xl mb-4 ${feedbackClass}`}><p className="text-sm font-bold">{feedback}</p></div><button onClick={handleNextQuestion} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">{state.currentQuestionIndex < state.quizQuestions.length - 1 ? '下一题' : '查看结果'} <ArrowRight className="w-5 h-5" /></button></div>)}
            </div>
        );
    };

    const CertificateScreen = () => {
        const isFullScore = state.score === state.quizQuestions.length;
        return (
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-0 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100 via-sky-50 to-sky-100">
                <div className={`bg-white p-8 rounded-2xl shadow-xl border-8 border-double ${isFullScore ? 'border-yellow-300' : 'border-gray-300'} w-full relative mx-4`}>
                   <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${isFullScore ? 'bg-yellow-400 text-white' : 'bg-gray-400 text-white'} px-6 py-2 rounded-full font-bold shadow-md whitespace-nowrap`}>{isFullScore ? '🌟 荣誉证书 🌟' : '💪 继续加油 💪'}</div>
                   <div className="mt-6 mb-4"><div className="w-24 h-24 bg-sky-100 rounded-full mx-auto flex items-center justify-center mb-2 border-4 border-sky-300 relative"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&${isFullScore ? '' : 'grayscale=true'}`} alt="avatar" className="w-20 h-20" /></div><p className="text-gray-500 text-sm">{isFullScore ? '恭喜小朋友' : '再接再厉'}</p><h2 className={`text-2xl font-black ${isFullScore ? 'text-sky-600' : 'text-gray-500'} my-2`}>{isFullScore ? '荣获“小小气象员”称号' : '距离称号只差一点点'}</h2></div>
                   <p className="text-gray-600 text-sm mb-6 bg-gray-50 p-3 rounded-lg">{isFullScore ? '太厉害了！你认识了所有的小动物气象员，真是个博学的小专家！' : `你的成绩是 ${state.score}/${state.quizQuestions.length}。别灰心！重新复习一下小动物的知识，再来挑战一次吧！`}</p>
                   <div className="flex justify-center space-x-2 mb-6"><span className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🐜</span><span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🐟</span><span className="text-3xl animate-bounce" style={{ animationDelay: '0.4s' }}>🦗</span></div>
                   <button onClick={handleGoHome} className={`${isFullScore ? 'bg-sky-500 hover:bg-sky-600' : 'bg-orange-400 hover:bg-orange-500'} text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 mx-auto text-sm`}><Home className="w-4 h-4" /> 返回主页</button>                   
                </div>
            </div>
        );
    };

    const StoryGeneratorScreen = () => {
        const maxSelected = state.selectedAnimals.length >= 3;
        return (
            <div className="relative z-10 flex flex-col h-full pt-0 pb-6 px-0">
                <h2 className="text-lg font-bold text-center text-sky-700 mb-4 bg-yellow-100 inline-block py-2 px-4 rounded-full mx-auto border border-yellow-300 flex items-center gap-2"><span className="text-xl">✨</span> 气象故事生成器</h2>
                <p className='text-sm text-gray-500 text-center mb-4'>选择 <b>1到3种</b> 小动物，让AI为你创作一个专属故事！</p>
                <div id="animal-selection-grid" className="flex-none grid grid-cols-3 gap-2 p-2 bg-white rounded-xl shadow-inner mb-4 max-h-56 overflow-y-auto">
                    {ANIMALS_GRID.map(item => {
                        const isSelected = state.selectedAnimals.includes(item.id);
                        const isDisabled = maxSelected && !isSelected;
                        return (<button key={item.id} onClick={() => handleToggleAnimalSelection(item.id)} className={`story-animal-button p-2 rounded-lg flex flex-col items-center transition-all text-xs font-bold ${isSelected ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300' : 'bg-gray-100 text-gray-600 hover:bg-sky-100 disabled:opacity-50'}`} disabled={isDisabled}><span className="text-xl mb-0.5">{item.icon}</span>{item.name}</button>);
                    })}
                </div>
                <button onClick={generateStory} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:bg-gray-400 mb-4" disabled={state.selectedAnimals.length === 0 || state.isGenerating}>{state.isGenerating ? <><Loader2 className="animate-spin h-5 w-5 text-white" />AI正在创作中...</> : <><Wand2 className="w-5 h-5 fill-current" />生成专属气象故事</>}</button>
                <div className="flex-1 bg-white p-4 rounded-xl shadow-inner border border-gray-200 overflow-y-auto text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {state.generatedStory ? (<div className='animate-fade-in'><div className="flex justify-between items-center mb-2 border-b pb-1"><h4 className='text-lg font-extrabold text-orange-500'>AI小故事</h4><div className="flex gap-2">{!isSpeaking ? (<button onClick={() => state.generatedStory && speak(state.generatedStory)} className="text-sky-500 hover:text-sky-600 p-1 rounded hover:bg-sky-50 transition-colors" title="播放语音"><Volume2 size={20} /></button>) : (<button onClick={stopSpeech} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors animate-pulse" title="停止播放"><Square size={20} fill="currentColor" /></button>)}</div></div>{state.generatedStory}</div>) : (<p className='text-center text-gray-400 italic mt-10'>{state.isGenerating ? "请稍候..." : "故事将会出现在这里。"}</p>)}
                </div>
            </div>
        );
    };

    const renderScreen = () => {
        switch (state.screen) {
            case 'intro': return <IntroScreen />;
            case 'learn': return <LearnScreen />;
            case 'quiz': return <QuizScreen />;
            case 'certificate': return <CertificateScreen />;
            case 'story_generator': return <StoryGeneratorScreen />;
            default: return <IntroScreen />;
        }
    };
    const MuteIcon = state.isMuted ? VolumeX : Volume2;

    return (
        <div className="bg-sky-100 flex items-center justify-center min-h-screen p-4">
            <style jsx global>{`
                /* 定义动画 */
                @keyframes bounce-slow { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } }
                .animate-bounce-slow { animation: bounce-slow 3s infinite; }
                @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
                /* 动物动画的自定义 CSS */
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
                .ant-animation { animation: pulse 1s infinite; }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
                .spider-animation { animation: spin-slow 10s linear infinite; }
                @keyframes fly-low { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } } 
                .bird-animation { animation: fly-low 2s infinite alternate; }
                @keyframes darting { 0%, 100% { transform: translateX(0) rotate(5deg); } 50% { transform: translateX(30px) rotate(-5deg); } } 
                .dragonfly-animation { animation: darting 2s infinite alternate; }
                @keyframes croak { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } } 
                .frog-animation { animation: croak 1s ease-in-out infinite; }
                @keyframes jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } } 
                .fish-animation { animation: jump 1.5s infinite alternate; }
                @keyframes sweat { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } } 
                .turtle-animation { animation: sweat 2s linear infinite; }
                @keyframes return-home { 0%, 100% { transform: translateX(-30px); } 50% { transform: translateX(30px); } } 
                .bee-animation { animation: return-home 1.5s infinite alternate; }
                @keyframes shake { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } } 
                .cicada-animation { animation: shake 0.1s linear infinite; }
            `}</style>
            
            <div id="app" className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-sky-200 relative h-[800px] flex flex-col">
                <div className="bg-sky-400 h-16 w-full absolute top-0 left-0 z-0 flex items-center justify-center"><div className="flex space-x-12 opacity-20"><Cloud className="w-10 h-10 text-white" /><Cloud className="w-16 h-16 text-white" /><Cloud className="w-10 h-10 text-white" /></div></div>
                <button onClick={handleToggleMute} className="absolute top-3 right-3 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors backdrop-blur-sm" title="切换静音"><MuteIcon className="w-5 h-5" /></button>
                {(state.screen !== 'intro' && state.screen !== 'certificate') && (<button onClick={handleGoHome} className="absolute top-3 left-3 z-20 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-colors backdrop-blur-sm" title="返回首页"><Home className="w-5 h-5" /></button>)}
                <div className="relative z-10 flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">{renderScreen()}</div>
            </div>
        </div>
    );
};

export default WeatherApp;