/**
 * Axios is a library that makes HTTP requests from your React frontend to 
 * your Spring Boot backend. Think of it like a messenger — when your React 
 * page loads, Axios goes and fetches data from localhost:8080 and brings it 
 * back so React can display it. You could use the browser's built-in fetch 
 * instead, but Axios is cleaner and handles errors better.
 */

import { useState, useEffect } from "react"
import axios from "axios"

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    axios.get("http://localhost:8080/api/test")
      .then(response => setMessage(response.data))
      .catch(error => console.log(error))
  }, [])

  return (
    <div>
      <h1>Hi, {message}</h1>
    </div>
  )
}

export default App