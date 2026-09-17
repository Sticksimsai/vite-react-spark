import { Routes, Route } from 'react-router-dom';
import { Shell } from '@/components/Shell';
import Home from '@/pages/Home';
import Discover from '@/pages/Discover';
import CoinPage from '@/pages/Coin';
import Launch from '@/pages/Launch';
import Rewards from '@/pages/Rewards';
import Numbers from '@/pages/Numbers';
import Rounds from '@/pages/Rounds';
import Docs from '@/pages/Docs';
import Status from '@/pages/Status';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';

export default function App() {
  return <Shell>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/discover" element={<Discover/>}/>
      <Route path="/coin/:id" element={<CoinPage/>}/>
      <Route path="/launch" element={<Launch/>}/>
      <Route path="/wallet" element={<Rewards/>}/>
      <Route path="/wallet/:address" element={<Rewards/>}/>
      <Route path="/analytics" element={<Numbers/>}/>
      <Route path="/rounds" element={<Rounds/>}/>
      <Route path="/docs" element={<Docs/>}/>
      <Route path="/status" element={<Status/>}/>
      <Route path="/terms" element={<Terms/>}/>
      <Route path="/privacy" element={<Privacy/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  </Shell>;
}
