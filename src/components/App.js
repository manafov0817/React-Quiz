import { useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import { useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived': return { ...state, questions: action.payload, status: 'ready' }
    case 'error': return { ...state, status: 'error' }
    case 'start': return { ...state, status: 'active' }
    case 'newAnswer': {
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points: state.points + (action.payload === question.correctOption ? question.points : 0)
      }
    }
    case 'nextQuestion': return { ...state, answer: null, index: state.index + 1 }

    default: throw new Error('this is unknown error');
  }
}

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0
}

export default function App() {

  const [{ questions, status, index, answer, points }, dispatch] = useReducer(reducer, initialState);

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
            <NextQuestion answer={answer} dispatch={dispatch} />
          </>}
      </Main>
    </div>);
}