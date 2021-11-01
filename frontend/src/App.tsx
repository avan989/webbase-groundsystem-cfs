import Header from './components/Header'
import EventsDisplay from './components/EventsDisplay'
import SendMessageAPI from './components/SendMessageAPI'

function App() {
  return (
    <div className="Container">
        <Header />
        <EventsDisplay />
        <SendMessageAPI />
    </div>

  );
}

export default App;
