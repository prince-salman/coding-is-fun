import { useState, useEffect } from 'react'
import _Editor from 'react-simple-code-editor'
const Editor = _Editor.default || _Editor
import Prism from 'prismjs'
import 'prismjs/components/prism-core'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css' 
import { CURRICULUM } from './curriculum'
import './App.css'
import { 
  Folder, FileCode, Search, GitBranch, Bug, Blocks, Settings, 
  ChevronDown, CheckCircle, Globe, ArrowLeft, ArrowRight, RotateCw, 
  GitMerge, XCircle, AlertTriangle, Play, Volume2, VolumeX
} from 'lucide-react'

let globalAudioCtx = null;

const getAudioCtx = () => {
  if (!globalAudioCtx) {
    globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
};

// Audio Context setup untuk efek suara sintesis
const playTypingSound = () => {
  try {
    const audioCtx = getAudioCtx();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.03); 
    
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch (e) { }
};

const playSuccessSound = () => {
  try {
    const audioCtx = getAudioCtx();
    const playNote = (freq, startTime) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    };
    
    const now = audioCtx.currentTime;
    playNote(523.25, now);       // C5
    playNote(659.25, now + 0.1); // E5
    playNote(783.99, now + 0.2); // G5
    playNote(1046.50, now + 0.3); // C6
  } catch(e) {}
};

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  
  const [chapterIndex, setChapterIndex] = useState(0)
  const [moduleIndex, setModuleIndex] = useState(0)
  const [xp, setXp] = useState(0)
  
  const currentChapter = CURRICULUM[chapterIndex]
  const currentModule = currentChapter.modules[moduleIndex]

  const [code, setCode] = useState(currentModule.initialCode)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Parse nama pemain ke dalam teks
  const parseText = (text) => text.replace(/\{\{playerName\}\}/g, playerName || "Developer");
  const displayedText = parseText(currentModule.description);
  const successText = parseText(currentModule.successMessage);

  // Web Speech API
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!isVoiceEnabled || !text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    
    // Coba cari suara cowok (biasanya ada nama Andika, Ardi, atau Male di sistem)
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => 
      v.lang.includes('id') && 
      (v.name.toLowerCase().includes('andika') || 
       v.name.toLowerCase().includes('ardi') || 
       v.name.toLowerCase().includes('male'))
    );

    if (maleVoice) {
      utterance.voice = maleVoice;
      utterance.pitch = 0.9; // Normal pitch untuk suara asli cowok
      utterance.rate = 0.95;
    } else {
      // Jika tidak ada suara cowok, gunakan pitch yang sedikit lebih rendah tapi tetap normal
      utterance.pitch = 0.8; // 0.1 terlalu robotik/aneh
      utterance.rate = 0.9; // Lebih santai dan berwibawa
    }
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Pastikan voices di-load oleh browser sebelum mencoba berbicara
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (isGameStarted && isVoiceEnabled && !isSuccess) {
      speakText(displayedText);
    }
  }, [displayedText, isGameStarted, isVoiceEnabled]);

  useEffect(() => {
    if (isSuccess && isVoiceEnabled) {
      speakText(successText);
    }
  }, [isSuccess]);

  // Hitung pangkat berdasarkan XP
  const getRank = (xpPoints) => {
    if (xpPoints < 300) return 'Trainee Intern';
    if (xpPoints < 600) return 'Junior Developer';
    if (xpPoints < 1000) return 'Mid-Level Dev';
    if (xpPoints < 1500) return 'Senior Developer';
    return 'Tech Lead';
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    playTypingSound();
  }

  useEffect(() => {
    if (!isGameStarted) return;
    
    if (currentModule.validator(code)) {
      if (!isSuccess) {
        setIsSuccess(true);
        playSuccessSound();
      }
    } else {
      setIsSuccess(false);
    }
  }, [code, currentModule, isSuccess, isGameStarted])

  const startGame = (e) => {
    e.preventDefault();
    if(playerName.trim() === "") return;
    setIsGameStarted(true);
  }

  const nextModule = () => {
    window.speechSynthesis.cancel();
    setXp(prev => prev + (isExam ? 300 : 100));

    if (moduleIndex < currentChapter.modules.length - 1) {
      const nextModIdx = moduleIndex + 1
      setModuleIndex(nextModIdx)
      setCode(currentChapter.modules[nextModIdx].initialCode)
      setIsSuccess(false)
    } else if (chapterIndex < CURRICULUM.length - 1) {
      const nextChapIdx = chapterIndex + 1
      setChapterIndex(nextChapIdx)
      setModuleIndex(0)
      setCode(CURRICULUM[nextChapIdx].modules[0].initialCode)
      setIsSuccess(false)
    } else {
      alert(`SELAMAT! Anda telah menyelesaikan kelas dengan total ${xp + 500} XP! Gelar Akhir Anda: ${getRank(xp + 500)}!`)
    }
  }

  const isExam = currentModule.type === 'ujian'

  if (!isGameStarted) {
    return (
      <div className="onboarding-container vscode-theme">
        <div className="onboarding-card">
          <div className="onboarding-logo">Tech<span>Nova</span></div>
          <h1>Selamat Datang di VS Code</h1>
          <p>Anda baru saja direkrut sebagai Junior Developer. Siapa nama Anda?</p>
          <form onSubmit={startGame} className="onboarding-form">
            <input 
              type="text" 
              placeholder="Masukkan nama Anda..." 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              autoFocus
              required
            />
            <div className="voice-toggle-onboard">
              <label>
                <input 
                  type="checkbox" 
                  checked={isVoiceEnabled} 
                  onChange={(e) => setIsVoiceEnabled(e.target.checked)} 
                /> 
                Aktifkan Suara Mentor (Auto-Play)
              </label>
            </div>
            <button type="submit"><Play size={16} style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 8}}/> Buka Workspace</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`vscode-app ${isExam ? 'exam-mode' : ''}`}>
      {/* Top Menu Bar */}
      <div className="vscode-menubar">
        <div className="menu-items">
          <span className="logo-icon"><Folder size={14} /></span>
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Run</span>
          <span>Terminal</span>
          <span>Help</span>
        </div>
        <div className="title-bar">
          TechNova Workspace - index.html - Visual Studio Code
        </div>
        <div className="window-controls">
          <span className="minimize"></span>
          <span className="maximize"></span>
          <span className="close"></span>
        </div>
      </div>

      <div className="vscode-body">
        {/* Activity Bar */}
        <div className="activity-bar">
          <div className="activity-icon active"><FileCode size={24} /></div>
          <div className="activity-icon"><Search size={24} /></div>
          <div className="activity-icon"><GitBranch size={24} /></div>
          <div className="activity-icon"><Bug size={24} /></div>
          <div className="activity-icon"><Blocks size={24} /></div>
          <div className="activity-bottom">
            <div className="activity-icon"><Settings size={24} /></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">EXPLORER</div>
          <div className="sidebar-section">
            <div className="section-title"><ChevronDown size={12} style={{marginRight: 4, display: 'inline-block', verticalAlign: 'middle'}}/> TECHNOVA_PROJECT</div>
            <div className="file-tree">
              <div className="tree-item active">
                <span className="file-icon html-icon">5</span>
                <span>index.html</span>
              </div>
              <div className="tree-item">
                <span className="file-icon css-icon">#</span>
                <span>style.css</span>
              </div>
              <div className="tree-item">
                <span className="file-icon js-icon">JS</span>
                <span>script.js</span>
              </div>
            </div>
          </div>
          <div className="sidebar-section progress-section">
            <div className="section-title"><ChevronDown size={12} style={{marginRight: 4, display: 'inline-block', verticalAlign: 'middle'}}/> KARIER DEVELOPER</div>
            <div className="stats-box">
              <p>User: <strong>{playerName}</strong></p>
              <p>Role: <span className="rank-badge">{getRank(xp)}</span></p>
              <p>XP: <strong>{xp}</strong> / 2000</p>
              <p>Bab: <strong>{chapterIndex + 1}/{CURRICULUM.length}</strong></p>
            </div>
            <button className="voice-toggle-btn" onClick={() => {
              setIsVoiceEnabled(!isVoiceEnabled);
              if (isVoiceEnabled) window.speechSynthesis.cancel();
            }}>
              {isVoiceEnabled ? <><Volume2 size={12} style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 4}}/> Suara: ON</> : <><VolumeX size={12} style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 4}}/> Suara: OFF</>}
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="editor-group">
          
          {/* Editor Tabs & Code */}
          <div className="editor-pane">
            <div className="editor-tabs">
              <div className="tab active">
                <span className="file-icon html-icon">5</span> index.html <span className="close-tab">×</span>
              </div>
              <div className="tab-breadcrumb">
                TechNova_Project {'>'} index.html
              </div>
            </div>
            
            <div className="code-container">
              <Editor
                value={code}
                onValueChange={handleCodeChange}
                highlight={code => Prism.highlight(code, Prism.languages.markup, 'markup')}
                padding={20}
                className="vs-code-editor"
                style={{
                  fontFamily: '"Fira Code", Consolas, monospace',
                  fontSize: 15,
                  minHeight: '100%',
                }}
              />
            </div>
          </div>

          {/* Terminal / Output Pane */}
          <div className="bottom-panel">
            <div className="panel-tabs">
              <span className="panel-tab">PROBLEMS</span>
              <span className="panel-tab active">TERMINAL</span>
              <span className="panel-tab">OUTPUT</span>
              <span className="panel-tab">DEBUG CONSOLE</span>
              <div className="panel-actions">
                <span className="action-icon">^</span>
                <span className="action-icon">x</span>
              </div>
            </div>
            <div className="terminal-content">
              <div className="mentor-message">
                <div className="mentor-header">
                  <span className="mentor-avatar">{currentModule.sender.avatar}</span>
                  <span className="mentor-name">{currentModule.sender.name} ({currentModule.sender.role})</span>
                  <span className="time-stamp">- {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="terminal-text typewriter">
                  {displayedText}
                </div>
                
                {isSuccess && (
                  <div className="terminal-success animate-fade-in">
                    <span className="success-icon"><CheckCircle size={14} style={{display: 'inline-block', verticalAlign: 'middle'}}/></span> {successText}
                    <button className="vscode-btn primary-btn mt-2" onClick={nextModule}>
                      {isExam ? "Jalankan Skrip Evaluasi Selanjutnya" : "Lanjut ke Baris Berikutnya"} <ArrowRight size={14} style={{display: 'inline-block', verticalAlign: 'middle', marginLeft: 4}}/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Live Preview Pane (Split Right) */}
        <div className="preview-pane">
          <div className="editor-tabs">
            <div className="tab active">
              <Globe size={14} style={{marginRight: 6}}/> Browser Preview
            </div>
          </div>
          <div className="preview-content">
            <div className="browser-address-bar">
              <span className="nav-btn"><ArrowLeft size={16} /></span>
              <span className="nav-btn"><ArrowRight size={16} /></span>
              <span className="nav-btn"><RotateCw size={16} /></span>
              <div className="url-bar">localhost:3000</div>
            </div>
            <div 
              className="live-output"
              dangerouslySetInnerHTML={{ __html: code }} 
            />
          </div>
        </div>

      </div>
      
      {/* Bottom Status Bar */}
      <div className="vscode-statusbar">
        <div className="status-left">
          <span className="status-item"><GitMerge size={12} style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 4}}/> master*</span>
          <span className="status-item"><XCircle size={12} style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 2}}/> 0 <AlertTriangle size={12} style={{display: 'inline-block', verticalAlign: 'middle', marginLeft: 6, marginRight: 2}}/> 0</span>
          <span className="status-item">Port: 3000</span>
        </div>
        <div className="status-right">
          <span className="status-item">Ln 1, Col 1</span>
          <span className="status-item">Spaces: 2</span>
          <span className="status-item">UTF-8</span>
          <span className="status-item">HTML</span>
          <span className="status-item">Prettier: <CheckCircle size={12} style={{display: 'inline-block', verticalAlign: 'middle', marginLeft: 2}}/></span>
        </div>
      </div>
    </div>
  )
}

export default App
