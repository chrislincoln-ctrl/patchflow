import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ScrollStory from './landing/ScrollStory';
import SlideProgress from './landing/SlideProgress';
import SceneBackdrop from './landing/SceneBackdrop';
import {
  BobSlide,
  FinalSlide,
  HeroSlide,
  ProblemSlide,
  WorkflowSlide,
} from './landing/slides';

export default function Landing() {
  const navigate = useNavigate();
  const { startDemo } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleRunDemo = useCallback(() => {
    startDemo();
    navigate('/dashboard');
  }, [startDemo, navigate]);

  const handleExplore = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const slides = [
    <HeroSlide key="hero" onRunDemo={handleRunDemo} onExplore={handleExplore} currentSlide={currentSlide} />,
    <ProblemSlide key="problem" active={currentSlide === 1} />,
    <WorkflowSlide key="workflow" active={currentSlide === 2} />,
    <BobSlide key="bob" active={currentSlide === 3} />,
    <FinalSlide key="final" onRunDemo={handleRunDemo} onExplore={handleExplore} active={currentSlide === 4} />,
  ];

  const headerLinkClass = (slideIndex: number | null) =>
    `transition-colors ${slideIndex !== null && currentSlide === slideIndex ? 'text-white' : 'hover:text-white'}`;

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {/* Cinematic scene backgrounds — crossfade + drift behind everything */}
      <div className="absolute inset-0" style={{ paddingTop: 57 }}>
        <SceneBackdrop active={currentSlide} />
      </div>

      {/* Full-screen scroll story */}
      <div className="absolute inset-0" style={{ paddingTop: 57 }}>
        <ScrollStory slides={slides} currentSlide={currentSlide} onSlideChange={setCurrentSlide} />
      </div>

      {/* Fixed header — stable across scene transitions */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-3.5"
        style={{
          borderBottom: '1px solid rgba(234, 242, 234, 0.09)',
          background: 'rgba(8, 10, 9, 0.72)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'rgba(234,242,234,0.06)', border: '1px solid rgba(234,242,234,0.14)' }}
          >
            <Activity size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <span className="font-bold tracking-widest text-sm" style={{ letterSpacing: '0.15em' }}>
            PATCHFLOW
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <button onClick={() => setCurrentSlide(1)} className={headerLinkClass(1)}>
            Workflow
          </button>
          <button onClick={() => setCurrentSlide(2)} className={headerLinkClass(2)}>
            How It Works
          </button>
          <button onClick={() => setCurrentSlide(3)} className={headerLinkClass(3)}>
            IBM Bob 2.0
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExplore}
            className="text-xs px-3 py-1.5 rounded transition-colors hover:bg-white/5"
            style={{ color: 'var(--text-secondary)', border: '1px solid rgba(234,242,234,0.16)' }}
          >
            Open Workspace
          </button>
          <button
            onClick={handleRunDemo}
            className="text-xs px-3 py-1.5 rounded font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#0C0D0B' }}
          >
            Run Demo
          </button>
        </div>
      </header>

      {/* Scene indicator */}
      <SlideProgress
        currentSlide={currentSlide}
        onSlideSelect={(i) => setCurrentSlide(i)}
      />
    </div>
  );
}
