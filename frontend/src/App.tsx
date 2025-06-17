
import { useEffect } from 'react'
import './App.css'
import {getAllThreads,individualThreads} from './axios'
import { db } from './db/schama'
function App() {

  useEffect(() => {
    const fetchThreads = async () => {
      const userId = "1717a3f8-42b7-4e5c-8d32-8324cf5e5dee"; // Example userId, replace with actual logic to get userId
      const threadId ="956967ec-4916-4729-991a-55d796465864"; // Example threadId, replace with actual logic to get threadId
      individualThreads(threadId)
      const threadTitles: string[] = [];
      await db.threads.each(thread => { threadTitles.push(thread.title) });
      if (threadTitles.length > 0) {
        console.log("Thread titles from IndexedDB:", threadTitles);
      } else {
        console.log("No threads found in IndexedDB.");
        getAllThreads( userId )
          .then(response => {
            console.log("Threads fetched successfully from db:", response);
          })
          .catch(error => {
            console.error("Error fetching threads:", error);
          });
      }
    };

    fetchThreads();
  }, [])
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1>
      </div>
      
    </>
  )
}

export default App
