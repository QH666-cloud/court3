import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { RoomPage } from './components/RoomPage';

type ViewState = 'landing' | 'room';

interface AppState {
  view: ViewState;
  roomId: string;
  nickname: string;
  role: 'male' | 'female' | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    roomId: '',
    nickname: '',
    role: null,
  });

  const handleJoin = (roomId: string, nickname: string, role: 'male' | 'female') => {
    setState({
      view: 'room',
      roomId,
      nickname,
      role,
    });
  };

  const handleLeave = () => {
    // Confirm exit
    if (confirm('确定要离开法庭吗？')) {
      setState({
        view: 'landing',
        roomId: '',
        nickname: '',
        role: null,
      });
    }
  };

  if (state.view === 'landing') {
    return <LandingPage onJoin={handleJoin} />;
  }

  if (state.view === 'room' && state.role) {
    return (
      <RoomPage
        roomId={state.roomId}
        nickname={state.nickname}
        role={state.role}
        onLeave={handleLeave}
      />
    );
  }

  return <div>Something went wrong...</div>;
}

export default App;