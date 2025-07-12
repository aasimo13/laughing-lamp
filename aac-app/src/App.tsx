import { useState, useEffect } from 'react'
import { 
  Hand, Heart, HelpCircle, Check, X, Users, 
  Droplets, Apple, Cookie, Milk, Bath,
  Smile, Frown, Moon, Brain, Clock, 
  GamepadIcon, Book, Music, TreePine,
  User, UserCheck,
  Star, Sparkles, Settings, Volume2, Plus, Edit, Save, Trash2, Palette
} from 'lucide-react'
import './App.css'

interface Word {
  id: string
  text: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  category: string
}

const WORDS: Word[] = [
  // Basic needs
  { id: '1', text: 'I want', icon: Hand, category: 'basic' },
  { id: '2', text: 'Please', icon: Heart, category: 'basic' },
  { id: '3', text: 'Thank you', icon: Heart, category: 'basic' },
  { id: '4', text: 'Help me', icon: HelpCircle, category: 'basic' },
  { id: '5', text: 'Yes', icon: Check, category: 'basic' },
  { id: '6', text: 'No', icon: X, category: 'basic' },
  { id: '7', text: 'I have to go potty', icon: Bath, category: 'basic' },
  { id: '8', text: 'I need a minute', icon: Clock, category: 'basic' },
  
  // Food & drink
  { id: '9', text: 'Water', icon: Droplets, category: 'food' },
  { id: '10', text: 'I\'m hungry', icon: Apple, category: 'food' },
  { id: '11', text: 'Snack', icon: Cookie, category: 'food' },
  { id: '12', text: 'Milk', icon: Milk, category: 'food' },
  
  // Feelings
  { id: '13', text: 'I\'m happy', icon: Smile, category: 'feelings' },
  { id: '14', text: 'I\'m sad', icon: Frown, category: 'feelings' },
  { id: '15', text: 'I\'m tired', icon: Moon, category: 'feelings' },
  { id: '16', text: 'I\'m overwhelmed', icon: Brain, category: 'feelings' },
  { id: '17', text: 'I love you', icon: Heart, category: 'feelings' },
  { id: '18', text: 'Hug please', icon: Users, category: 'feelings' },
  
  // Activities
  { id: '19', text: 'Play', icon: GamepadIcon, category: 'activities' },
  { id: '20', text: 'Book', icon: Book, category: 'activities' },
  { id: '21', text: 'Music', icon: Music, category: 'activities' },
  { id: '22', text: 'Outside', icon: TreePine, category: 'activities' },
  
  // People
  { id: '23', text: 'Mama', icon: User, category: 'people' },
  { id: '24', text: 'Dada', icon: UserCheck, category: 'people' },
  { id: '25', text: 'Friend', icon: Users, category: 'people' },
]

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Sparkles },
  { id: 'basic', name: 'Basic', icon: Star },
  { id: 'food', name: 'Food', icon: Apple },
  { id: 'feelings', name: 'Feelings', icon: Heart },
  { id: 'activities', name: 'Activities', icon: GamepadIcon },
  { id: 'people', name: 'People', icon: Users },
]

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sentence, setSentence] = useState<string[]>([])
  const [voicesLoaded, setVoicesLoaded] = useState(false)
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(-1)
  const [words, setWords] = useState<Word[]>(WORDS)
  const [editingWord, setEditingWord] = useState<string | null>(null)
  const [showAddWord, setShowAddWord] = useState(false)
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.85,
    pitch: 1.5,
    volume: 0.9
  })
  const [theme, setTheme] = useState('purple')
  const [editMode, setEditMode] = useState(false)

  // Load saved data from localStorage
  useEffect(() => {
    const savedWords = localStorage.getItem('aac-words')
    const savedVoiceSettings = localStorage.getItem('aac-voice-settings')
    const savedTheme = localStorage.getItem('aac-theme')
    const savedVoiceIndex = localStorage.getItem('aac-voice-index')

    if (savedWords) {
      try {
        setWords(JSON.parse(savedWords))
      } catch (e) {
        console.error('Failed to load saved words:', e)
      }
    }

    if (savedVoiceSettings) {
      try {
        setVoiceSettings(JSON.parse(savedVoiceSettings))
      } catch (e) {
        console.error('Failed to load voice settings:', e)
      }
    }

    if (savedTheme) {
      setTheme(savedTheme)
    }

    if (savedVoiceIndex) {
      setSelectedVoiceIndex(parseInt(savedVoiceIndex))
    }
  }, [])

  // Ensure voices are loaded
  useEffect(() => {
    const loadVoices = () => {
      if (speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true)
      }
    }

    loadVoices()
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('aac-words', JSON.stringify(words))
  }, [words])

  useEffect(() => {
    localStorage.setItem('aac-voice-settings', JSON.stringify(voiceSettings))
  }, [voiceSettings])

  useEffect(() => {
    localStorage.setItem('aac-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('aac-voice-index', selectedVoiceIndex.toString())
  }, [selectedVoiceIndex])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Get available voices
      const voices = speechSynthesis.getVoices()
      
      let chosenVoice: SpeechSynthesisVoice | null = null
      
      // Use manually selected voice if available
      if (selectedVoiceIndex >= 0 && voices[selectedVoiceIndex]) {
        chosenVoice = voices[selectedVoiceIndex]
      } else {
        // Try to find a female or child-like voice automatically
        chosenVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('girl') ||
          voice.name.toLowerCase().includes('child') ||
          voice.name.toLowerCase().includes('kids') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('victoria') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('allison') ||
          voice.name.toLowerCase().includes('ava')
        ) || voices.find(voice => voice.lang.startsWith('en') && voice.default) || null
      }
      
      if (chosenVoice) {
        utterance.voice = chosenVoice
      }
      
      // Use customizable voice settings
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume
      
      speechSynthesis.speak(utterance)
    }
  }

  const testVoice = (voiceIndex: number) => {
    setSelectedVoiceIndex(voiceIndex)
    setTimeout(() => speak("Hi! This is how I sound."), 100)
  }

  const addWord = (text: string, category: string, iconName: string = 'Star') => {
    const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
      Star, Heart, Hand, Check, X, Users, Droplets, Apple, Cookie, Milk, Bath,
      Smile, Frown, Moon, Brain, Clock, GamepadIcon, Book, Music, TreePine, User, UserCheck
    }
    
    const newWord: Word = {
      id: Date.now().toString(),
      text,
      icon: iconMap[iconName] || Star,
      category
    }
    setWords(prev => [...prev, newWord])
  }

  const editWord = (id: string, text: string, category: string) => {
    setWords(prev => prev.map(word => 
      word.id === id ? { ...word, text, category } : word
    ))
    setEditingWord(null)
  }

  const deleteWord = (id: string) => {
    setWords(prev => prev.filter(word => word.id !== id))
  }

  const addToSentence = (word: Word) => {
    const newSentence = [...sentence, word.text]
    setSentence(newSentence)
    speak(word.text)
  }

  const speakSentence = () => {
    if (sentence.length > 0) {
      const fullSentence = sentence.join(' ')
      speak(fullSentence)
    }
  }

  const clearSentence = () => {
    setSentence([])
  }

  const filteredWords = selectedCategory === 'all' 
    ? words 
    : words.filter(word => word.category === selectedCategory)

  return (
    <div className={`app theme-${theme}`}>
      <header className="header">
        <div className="header-content">
          <h1>My Voice 💬</h1>
          <div className="header-controls">
            <button 
              className={`edit-mode-btn ${editMode ? 'active' : ''}`}
              onClick={() => setEditMode(!editMode)}
            >
              <Edit size={18} />
            </button>
            <button 
              className="theme-btn"
              onClick={() => {
                const themes = ['purple', 'blue', 'green', 'pink', 'orange']
                const currentIndex = themes.indexOf(theme)
                const nextTheme = themes[(currentIndex + 1) % themes.length]
                setTheme(nextTheme)
              }}
            >
              <Palette size={18} />
            </button>
            <button 
              className="voice-settings-btn"
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        {showVoiceSettings && voicesLoaded && (
          <div className="voice-settings">
            <div className="voice-controls">
              <h3>Voice Settings:</h3>
              <div className="voice-sliders">
                <div className="slider-group">
                  <label>Speed: {voiceSettings.rate.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0.3"
                    max="2"
                    step="0.1"
                    value={voiceSettings.rate}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="slider-group">
                  <label>Pitch: {voiceSettings.pitch.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.pitch}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="slider-group">
                  <label>Volume: {voiceSettings.volume.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={voiceSettings.volume}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                  />
                </div>
                <button 
                  className="test-voice-btn"
                  onClick={() => speak("This is how I sound with these settings")}
                >
                  Test Voice
                </button>
              </div>
            </div>
            
            <div className="voice-selection">
              <h3>Choose Voice:</h3>
              <div className="voice-list">
                {speechSynthesis.getVoices()
                  .filter(voice => voice.lang.startsWith('en'))
                  .map((voice) => {
                    const actualIndex = speechSynthesis.getVoices().indexOf(voice)
                    return (
                      <button
                        key={voice.name}
                        className={`voice-option ${selectedVoiceIndex === actualIndex ? 'selected' : ''}`}
                        onClick={() => testVoice(actualIndex)}
                      >
                        <Volume2 size={16} />
                        <span>{voice.name}</span>
                      </button>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="sentence-bar">
        <div className="sentence-display">
          {sentence.length > 0 ? sentence.join(' ') : 'Tap words to make a sentence...'}
        </div>
        <div className="sentence-controls">
          <button 
            className="speak-btn"
            onClick={speakSentence}
            disabled={sentence.length === 0}
          >
            🔊 Speak
          </button>
          <button 
            className="clear-btn"
            onClick={clearSentence}
            disabled={sentence.length === 0}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="categories">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon size={24} className="category-icon" />
            <span className="category-name">{category.name}</span>
          </button>
        ))}
        {editMode && (
          <button
            className="add-word-btn"
            onClick={() => setShowAddWord(true)}
          >
            <Plus size={24} className="add-icon" />
            <span className="add-text">Add Word</span>
          </button>
        )}
      </div>

      <div className="words-grid">
        {filteredWords.map(word => (
          <div key={word.id} className="word-container">
            {editingWord === word.id ? (
              <WordEditForm 
                word={word}
                onSave={editWord}
                onCancel={() => setEditingWord(null)}
              />
            ) : (
              <button
                className="word-btn"
                onClick={() => !editMode && addToSentence(word)}
              >
                <word.icon size={40} className="word-icon" />
                <span className="word-text">{word.text}</span>
                {editMode && (
                  <div className="word-edit-controls">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingWord(word.id)
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteWord(word.id)
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </button>
            )}
          </div>
        ))}
        {showAddWord && (
          <AddWordForm
            onAdd={addWord}
            onCancel={() => setShowAddWord(false)}
          />
        )}
      </div>
    </div>
  )
}

// Form components
interface WordEditFormProps {
  word: Word
  onSave: (id: string, text: string, category: string) => void
  onCancel: () => void
}

function WordEditForm({ word, onSave, onCancel }: WordEditFormProps) {
  const [text, setText] = useState(word.text)
  const [category, setCategory] = useState(word.category)

  return (
    <div className="word-edit-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Word text"
        autoFocus
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <div className="form-buttons">
        <button onClick={() => onSave(word.id, text, category)}>
          <Save size={16} />
        </button>
        <button onClick={onCancel}>
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

interface AddWordFormProps {
  onAdd: (text: string, category: string, iconName?: string) => void
  onCancel: () => void
}

function AddWordForm({ onAdd, onCancel }: AddWordFormProps) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState('basic')

  const handleSubmit = () => {
    if (text.trim()) {
      onAdd(text.trim(), category)
      setText('')
      onCancel()
    }
  }

  return (
    <div className="add-word-form">
      <Plus size={40} className="add-word-icon" />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New word..."
        autoFocus
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <div className="form-buttons">
        <button onClick={handleSubmit} disabled={!text.trim()}>
          <Save size={16} />
        </button>
        <button onClick={onCancel}>
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default App
