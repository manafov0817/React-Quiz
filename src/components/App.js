import { useEffect } from "react";
import { useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

function reducer(state, action) {

  const SECS = 30;
  switch (action.type) {
    case 'dataReceived': return { ...state, questions: action.payload, status: 'ready' }
    case 'error': return { ...state, status: 'error' }
    case 'start': return { ...state, secondsRemaining: state.questions.length * SECS, status: 'active' }
    case 'newAnswer': {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: state.points + (action.payload === question.correctOption ? question.points : 0)
      }
    }
    case 'nextQuestion': {
      if (state.index === state.questions.length - 1) return { ...state, status: 'finished' }
      return { ...state, answer: null, index: state.index + 1 }
    }
    case 'restart': return { ...initialState, questions: state.questions, status: "ready" }
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status
      }
    default: throw new Error('this is unknown error');
  }
}

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null
}

export default function App() {
  const [{ questions, status, index, answer, points, secondsRemaining }, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
      .then(res => res.json())
      .then(data => dispatch({ type: 'dataReceived', payload: data }))
      .catch(err => dispatch({ type: 'error' }))
  }, [])

  return (
    <div className="app">
      <Header />
      <Main >
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' &&
          <>
            <Progress questionCount={questions.length} index={index} points={points} maxPoints={maxPoints} answer={answer} />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextQuestion answer={answer} dispatch={dispatch} />
            </Footer>

          </>}
        {status === 'finished' && <FinishScreen dispatch={dispatch} points={points} maxPoints={maxPoints} />}
      </Main>
    </div>);
}