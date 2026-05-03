import { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';

const Quiz = () => {
  const [quizState, setQuizState] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [startTime, setStartTime] = useState(null);

  const subjects = ['Mathematics', 'English', 'General Knowledge', 'Reasoning', 'Science'];

  const startQuiz = async () => {
    try {
      const { data } = await quizAPI.getQuestions({ subject: selectedSubject, topic: selectedTopic, limit: 20 });
      if (data.data.length === 0) {
        alert('No questions available for this selection');
        return;
      }
      setQuestions(data.data);
      setAnswers(new Array(data.data.length).fill(null));
      setTimeLeft(data.data.length * 90);
      setStartTime(new Date());
      setQuizState('quiz');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (quizState === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      submitQuiz();
    }
  }, [timeLeft, quizState]);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    try {
      const quizAnswers = questions.map((q, i) => ({
        questionId: q._id,
        selectedAnswer: answers[i]
      }));

      const response = await quizAPI.submitQuiz({
        subject: selectedSubject,
        topic: selectedTopic,
        answers: quizAnswers,
        timeTakenSeconds: (questions.length * 90) - timeLeft,
        startedAt: startTime
      });

      setResult(response.data.data);
      setQuizState('result');
    } catch (error) {
      console.error(error);
      alert('Failed to submit quiz');
    }
  };

  const resetQuiz = () => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizState === 'setup') {
    return (
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card">
          <div className="card-header">
            <h2 style={{ margin: 0 }}>Quiz Practice</h2>
          </div>

          <div className="form-group">
            <label>Select Subject</label>
            <select className="form-control" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">Choose a subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Topic (Optional)</label>
            <input type="text" className="form-control" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} placeholder="Enter topic or leave blank" />
          </div>

          <div className="alert alert-info">
            <strong>Instructions:</strong> You will get 20 questions with 90 seconds per question. Select the correct answer for each question.
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={startQuiz} disabled={!selectedSubject}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'quiz' && questions.length > 0) {
    const question = questions[currentQuestion];
    return (
      <div className="container" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontWeight: '600' }}>Question {currentQuestion + 1} of {questions.length}</span>
          <span style={{ fontWeight: '600', color: timeLeft < 300 ? 'var(--accent)' : 'var(--primary)' }}>Time: {formatTime(timeLeft)}</span>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>{question.question}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {question.options.map((option, idx) => (
              <label key={idx} className="checkbox-custom" style={{ 
                padding: '16px', 
                border: answers[currentQuestion] === idx ? '2px solid var(--accent)' : '1px solid var(--border-light)', 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer', 
                backgroundColor: answers[currentQuestion] === idx ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                transition: 'var(--transition)'
              }}>
                <input type="radio" name="answer" checked={answers[currentQuestion] === idx} onChange={() => handleAnswer(idx)} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '15px' }}>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn btn-outline" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>Previous</button>
          {currentQuestion === questions.length - 1 ? (
            <button className="btn btn-primary" onClick={submitQuiz}>Submit Quiz</button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentQuestion(currentQuestion + 1)}>Next</button>
          )}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {questions.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentQuestion(idx)} className="btn btn-sm" style={{ 
              width: '40px', 
              height: '40px', 
              padding: 0, 
              backgroundColor: idx === currentQuestion ? 'var(--primary)' : answers[idx] !== null ? 'var(--success)' : 'var(--bg-main)', 
              color: idx === currentQuestion || answers[idx] !== null ? 'white' : 'var(--text-main)', 
              border: answers[idx] !== null ? 'none' : '1px solid var(--border)',
              borderRadius: '8px',
              fontWeight: '700'
            }}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (quizState === 'result' && result) {
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '24px' }}>Quiz Result</h2>

          <div style={{ fontSize: '72px', fontWeight: 'bold', color: result.score >= 60 ? 'var(--success)' : 'var(--accent)', marginBottom: '8px' }}>{result.score}%</div>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px' }}>{result.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '16px', backgroundColor: '#c6f6d5', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22543d' }}>{result.correctAnswers}</div>
              <div style={{ fontSize: '14px', color: '#22543d' }}>Correct</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fed7d7', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#742a2a' }}>{result.wrongAnswers}</div>
              <div style={{ fontSize: '14px', color: '#742a2a' }}>Wrong</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fefcbf', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#744210' }}>{result.unanswered}</div>
              <div style={{ fontSize: '14px', color: '#744210' }}>Unanswered</div>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={resetQuiz}>Take Another Quiz</button>
        </div>

        {result.results && result.results.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Question-wise Results</h3>
            {result.results.map((r, idx) => (
              <div key={idx} className="card" style={{ marginBottom: '12px', borderLeft: `4px solid ${r.isCorrect ? 'var(--success)' : r.selectedAnswer === null || r.selectedAnswer === undefined ? 'var(--warning)' : 'var(--accent)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>Question {idx + 1}</strong>
                  <span style={{ color: r.isCorrect ? 'var(--success)' : r.selectedAnswer === null || r.selectedAnswer === undefined ? 'var(--warning)' : 'var(--accent)', fontWeight: '600' }}>
                    {r.isCorrect ? 'Correct' : r.selectedAnswer === null || r.selectedAnswer === undefined ? 'Unanswered' : 'Wrong'}
                  </span>
                </div>
                <p style={{ marginBottom: '12px' }}>{r.question}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {r.options.map((opt, i) => (
                    <div key={i} style={{
                      padding: '8px 12px', borderRadius: 'var(--radius)',
                      backgroundColor: r.correctAnswer === i ? '#c6f6d5' : r.selectedAnswer === i && !r.isCorrect ? '#fed7d7' : 'transparent',
                      border: r.correctAnswer === i ? '1px solid #22543d' : r.selectedAnswer === i && !r.isCorrect ? '1px solid #742a2a' : '1px solid var(--border)'
                    }}>
                      {opt} {r.correctAnswer === i && ' ✓ (Correct)'} {r.selectedAnswer === i && !r.isCorrect && ' ✗ (Your Answer)'}
                    </div>
                  ))}
                </div>
                {r.explanation && (
                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f0f4ff', borderRadius: 'var(--radius)', fontSize: '14px' }}>
                    <strong>Explanation:</strong> {r.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Quiz;
