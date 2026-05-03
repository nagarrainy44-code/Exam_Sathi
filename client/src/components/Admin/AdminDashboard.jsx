import { useState } from 'react';
import { materialAPI, examAPI, quizAPI } from '../../services/api';

const emptyQuestion = () => ({ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'medium' });

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const examTypes = ['UPSC', 'SSC', 'Banking', 'Railways', 'State PSC', 'Defense'];
  const subjects = ['Mathematics', 'English', 'General Knowledge', 'Reasoning', 'Science', 'History', 'Geography', 'Polity'];
  const difficulties = ['easy', 'medium', 'hard'];

  // Material upload state
  const [materialData, setMaterialData] = useState({ title: '', description: '', subject: '', examType: '', topic: '', fileType: 'pdf', isPublished: true });
  const [file, setFile] = useState(null);

  // Exam/Timetable state
  const [examData, setExamData] = useState({
    examName: '', examType: '', notificationDate: '', applicationStart: '', applicationEnd: '',
    examDate: '', resultDate: '', eligibility: '', ageLimit: '', vacancies: '', officialLink: '', description: '', isActive: true
  });

  // Single Quiz Question state
  const [questionData, setQuestionData] = useState({
    subject: '', topic: '', examType: '', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'medium', year: ''
  });

  // Bulk Quiz Questions state
  const [bulkData, setBulkData] = useState({ subject: '', topic: '', examType: '', year: '', questions: [emptyQuestion()] });

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      Object.keys(materialData).forEach(key => uploadData.append(key, materialData[key]));
      await materialAPI.upload(uploadData);
      setMessage('Material uploaded successfully');
      setMaterialData({ title: '', description: '', subject: '', examType: '', topic: '', fileType: 'pdf', isPublished: true });
      setFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await examAPI.create(examData);
      setMessage('Exam timetable created successfully');
      setExamData({ examName: '', examType: '', notificationDate: '', applicationStart: '', applicationEnd: '', examDate: '', resultDate: '', eligibility: '', ageLimit: '', vacancies: '', officialLink: '', description: '', isActive: true });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const trimmedOptions = questionData.options.map(o => o.trim());
      const filledOptions = trimmedOptions.filter(o => o);
      if (filledOptions.length < 2) {
        setMessage('Please provide at least 2 options');
        setLoading(false);
        return;
      }
      // Remap correctAnswer index after filtering
      const originalCorrect = trimmedOptions[questionData.correctAnswer];
      const newCorrectIndex = filledOptions.indexOf(originalCorrect);
      const payload = {
        ...questionData,
        options: filledOptions,
        correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0,
        year: questionData.year ? parseInt(questionData.year) : undefined
      };
      await quizAPI.createQuestion(payload);
      setMessage('Question added successfully');
      setQuestionData({ subject: '', topic: '', examType: '', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'medium', year: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const questions = bulkData.questions
        .filter(q => q.question && q.options.map(o => o.trim()).filter(o => o).length >= 2)
        .map(q => {
          const trimmedOptions = q.options.map(o => o.trim());
          const filledOptions = trimmedOptions.filter(o => o);
          const originalCorrect = trimmedOptions[q.correctAnswer];
          const newCorrectIndex = filledOptions.indexOf(originalCorrect);
          return {
            subject: bulkData.subject,
            topic: bulkData.topic,
            examType: bulkData.examType,
            year: bulkData.year ? parseInt(bulkData.year) : undefined,
            question: q.question,
            options: filledOptions,
            correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0,
            explanation: q.explanation,
            difficulty: q.difficulty
          };
        });
      if (questions.length === 0) {
        setMessage('Please add at least one valid question with 2+ options');
        setLoading(false);
        return;
      }
      const res = await quizAPI.bulkCreateQuestions({ questions });
      setMessage(`${res.data.count} questions added successfully to "${bulkData.topic}"`);
      setBulkData({ subject: '', topic: '', examType: '', year: '', questions: [emptyQuestion()] });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add questions');
    } finally {
      setLoading(false);
    }
  };

  const addBulkQuestion = () => {
    setBulkData({ ...bulkData, questions: [...bulkData.questions, emptyQuestion()] });
  };

  const updateBulkQuestion = (idx, field, value) => {
    const updated = [...bulkData.questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setBulkData({ ...bulkData, questions: updated });
  };

  const removeBulkQuestion = (idx) => {
    setBulkData({ ...bulkData, questions: bulkData.questions.filter((_, i) => i !== idx) });
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>Admin Panel</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap', background: 'var(--bg-main)', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <button className="btn btn-sm" style={{ 
          backgroundColor: activeTab === 'upload' ? 'var(--primary)' : 'transparent',
          color: activeTab === 'upload' ? 'white' : 'var(--text-main)',
          fontWeight: '700'
        }} onClick={() => setActiveTab('upload')}>Upload Material</button>
        <button className="btn btn-sm" style={{ 
          backgroundColor: activeTab === 'timetable' ? 'var(--primary)' : 'transparent',
          color: activeTab === 'timetable' ? 'white' : 'var(--text-main)',
          fontWeight: '700'
        }} onClick={() => setActiveTab('timetable')}>Create Timetable</button>
        <button className="btn btn-sm" style={{ 
          backgroundColor: activeTab === 'quiz' ? 'var(--primary)' : 'transparent',
          color: activeTab === 'quiz' ? 'white' : 'var(--text-main)',
          fontWeight: '700'
        }} onClick={() => setActiveTab('quiz')}>Add Question</button>
        <button className="btn btn-sm" style={{ 
          backgroundColor: activeTab === 'bulk' ? 'var(--primary)' : 'transparent',
          color: activeTab === 'bulk' ? 'white' : 'var(--text-main)',
          fontWeight: '700'
        }} onClick={() => setActiveTab('bulk')}>Bulk Add Questions</button>
      </div>

      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

      {activeTab === 'upload' && (
        <div className="card">
          <div className="card-header"><h3 style={{ margin: 0 }}>Upload Study Material</h3></div>
          <form onSubmit={handleMaterialSubmit}>
            <div className="form-group"><label>Title</label><input type="text" className="form-control" value={materialData.title} onChange={(e) => setMaterialData({ ...materialData, title: e.target.value })} required placeholder="e.g. Indian Constitution Notes" /></div>
            <div className="form-group"><label>Description</label><textarea className="form-control" value={materialData.description} onChange={(e) => setMaterialData({ ...materialData, description: e.target.value })} rows={3} placeholder="Brief description" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Subject</label>
                <select className="form-control" value={materialData.subject} onChange={(e) => setMaterialData({ ...materialData, subject: e.target.value })} required>
                  <option value="">Select Subject</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Exam Type</label>
                <select className="form-control" value={materialData.examType} onChange={(e) => setMaterialData({ ...materialData, examType: e.target.value })} required>
                  <option value="">Select Exam</option>{examTypes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Topic</label><input type="text" className="form-control" value={materialData.topic} onChange={(e) => setMaterialData({ ...materialData, topic: e.target.value })} placeholder="e.g. Fundamental Rights" /></div>
            </div>
            <div className="form-group"><label>File (PDF or Image, Max 10MB)</label><input type="file" className="form-control" accept=".pdf,image/jpeg,image/png" onChange={(e) => setFile(e.target.files[0])} required /></div>
            <div className="form-group">
              <label className="checkbox-custom"><input type="checkbox" checked={materialData.isPublished} onChange={(e) => setMaterialData({ ...materialData, isPublished: e.target.checked })} />Publish immediately</label>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !file}>{loading ? 'Uploading...' : 'Upload Material'}</button>
          </form>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="card">
          <div className="card-header"><h3 style={{ margin: 0 }}>Create Exam Timetable</h3></div>
          <form onSubmit={handleExamSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group"><label>Exam Name</label><input type="text" className="form-control" value={examData.examName} onChange={(e) => setExamData({ ...examData, examName: e.target.value })} required placeholder="e.g. UPSC Civil Services" /></div>
              <div className="form-group">
                <label>Exam Type</label>
                <select className="form-control" value={examData.examType} onChange={(e) => setExamData({ ...examData, examType: e.target.value })} required>
                  <option value="">Select Type</option>{examTypes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Exam Date</label><input type="date" className="form-control" value={examData.examDate} onChange={(e) => setExamData({ ...examData, examDate: e.target.value })} required /></div>
              <div className="form-group"><label>Application Start</label><input type="date" className="form-control" value={examData.applicationStart} onChange={(e) => setExamData({ ...examData, applicationStart: e.target.value })} /></div>
              <div className="form-group"><label>Application End</label><input type="date" className="form-control" value={examData.applicationEnd} onChange={(e) => setExamData({ ...examData, applicationEnd: e.target.value })} /></div>
              <div className="form-group"><label>Result Date</label><input type="date" className="form-control" value={examData.resultDate} onChange={(e) => setExamData({ ...examData, resultDate: e.target.value })} /></div>
              <div className="form-group"><label>Notification Date</label><input type="date" className="form-control" value={examData.notificationDate} onChange={(e) => setExamData({ ...examData, notificationDate: e.target.value })} /></div>
              <div className="form-group"><label>Vacancies</label><input type="number" className="form-control" value={examData.vacancies} onChange={(e) => setExamData({ ...examData, vacancies: e.target.value })} placeholder="e.g. 1000" /></div>
            </div>
            <div className="form-group"><label>Eligibility</label><input type="text" className="form-control" value={examData.eligibility} onChange={(e) => setExamData({ ...examData, eligibility: e.target.value })} placeholder="e.g. Graduate" /></div>
            <div className="form-group"><label>Age Limit</label><input type="text" className="form-control" value={examData.ageLimit} onChange={(e) => setExamData({ ...examData, ageLimit: e.target.value })} placeholder="e.g. 21-32 years" /></div>
            <div className="form-group"><label>Official Link</label><input type="url" className="form-control" value={examData.officialLink} onChange={(e) => setExamData({ ...examData, officialLink: e.target.value })} placeholder="https://..." /></div>
            <div className="form-group"><label>Description</label><textarea className="form-control" value={examData.description} onChange={(e) => setExamData({ ...examData, description: e.target.value })} rows={3} placeholder="Exam details" /></div>
            <div className="form-group">
              <label className="checkbox-custom"><input type="checkbox" checked={examData.isActive} onChange={(e) => setExamData({ ...examData, isActive: e.target.checked })} />Active</label>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Creating...' : 'Create Timetable'}</button>
          </form>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="card">
          <div className="card-header"><h3 style={{ margin: 0 }}>Add Quiz Question</h3></div>
          <form onSubmit={handleQuestionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Subject</label>
                <select className="form-control" value={questionData.subject} onChange={(e) => setQuestionData({ ...questionData, subject: e.target.value })} required>
                  <option value="">Select Subject</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Exam Type</label>
                <select className="form-control" value={questionData.examType} onChange={(e) => setQuestionData({ ...questionData, examType: e.target.value })}>
                  <option value="">Select Type</option>{examTypes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select className="form-control" value={questionData.difficulty} onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}>
                  {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Topic</label><input type="text" className="form-control" value={questionData.topic} onChange={(e) => setQuestionData({ ...questionData, topic: e.target.value })} placeholder="e.g. Algebra" /></div>
              <div className="form-group"><label>Year (Optional)</label><input type="number" className="form-control" value={questionData.year} onChange={(e) => setQuestionData({ ...questionData, year: e.target.value })} placeholder="e.g. 2023" /></div>
            </div>
            <div className="form-group"><label>Question</label><textarea className="form-control" value={questionData.question} onChange={(e) => setQuestionData({ ...questionData, question: e.target.value })} rows={2} required placeholder="Enter the question" /></div>
            <div className="form-group">
              <label>Options</label>
              {questionData.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <input type="radio" name="correctAnswer" checked={questionData.correctAnswer === i} onChange={() => setQuestionData({ ...questionData, correctAnswer: i })} />
                  <input type="text" className="form-control" value={opt} onChange={(e) => { const opts = [...questionData.options]; opts[i] = e.target.value; setQuestionData({ ...questionData, options: opts }); }} placeholder={`Option ${i + 1}`} />
                </div>
              ))}
              <small style={{ color: 'var(--text-secondary)' }}>Select the radio button for the correct answer</small>
            </div>
            <div className="form-group"><label>Explanation (Optional)</label><textarea className="form-control" value={questionData.explanation} onChange={(e) => setQuestionData({ ...questionData, explanation: e.target.value })} rows={2} placeholder="Explain the correct answer" /></div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Adding...' : 'Add Question'}</button>
          </form>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="card">
          <div className="card-header"><h3 style={{ margin: 0 }}>Bulk Add Questions for a Topic</h3></div>
          <form onSubmit={handleBulkSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label>Subject</label>
                <select className="form-control" value={bulkData.subject} onChange={(e) => setBulkData({ ...bulkData, subject: e.target.value })} required>
                  <option value="">Select Subject</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Topic/Series Name</label>
                <input type="text" className="form-control" value={bulkData.topic} onChange={(e) => setBulkData({ ...bulkData, topic: e.target.value })} required placeholder="e.g. Algebra Basics" />
              </div>
              <div className="form-group">
                <label>Exam Type</label>
                <select className="form-control" value={bulkData.examType} onChange={(e) => setBulkData({ ...bulkData, examType: e.target.value })}>
                  <option value="">Select Type</option>{examTypes.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Year (Optional)</label><input type="number" className="form-control" value={bulkData.year} onChange={(e) => setBulkData({ ...bulkData, year: e.target.value })} placeholder="e.g. 2023" /></div>
            </div>

            <h4 style={{ marginTop: '24px', marginBottom: '16px' }}>Questions ({bulkData.questions.length})</h4>
            {bulkData.questions.map((q, idx) => (
              <div key={idx} className="card" style={{ marginBottom: '16px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong>Question {idx + 1}</strong>
                  {bulkData.questions.length > 1 && (
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => removeBulkQuestion(idx)}>Remove</button>
                  )}
                </div>
                <div className="form-group">
                  <label>Question</label>
                  <textarea className="form-control" value={q.question} onChange={(e) => updateBulkQuestion(idx, 'question', e.target.value)} rows={2} placeholder="Enter question" required />
                </div>
                <div className="form-group">
                  <label>Options</label>
                  {q.options.map((opt, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <input type="radio" name={`correct-${idx}`} checked={q.correctAnswer === i} onChange={() => updateBulkQuestion(idx, 'correctAnswer', i)} />
                      <input type="text" className="form-control" value={opt} onChange={(e) => { const opts = [...q.options]; opts[i] = e.target.value; updateBulkQuestion(idx, 'options', opts); }} placeholder={`Option ${i + 1}`} />
                    </div>
                  ))}
                  <small style={{ color: 'var(--text-secondary)' }}>Select the radio button for the correct answer</small>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select className="form-control" value={q.difficulty} onChange={(e) => updateBulkQuestion(idx, 'difficulty', e.target.value)}>
                      {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Explanation (Optional)</label><textarea className="form-control" value={q.explanation} onChange={(e) => updateBulkQuestion(idx, 'explanation', e.target.value)} rows={2} placeholder="Explain the correct answer" /></div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button type="button" className="btn btn-outline" onClick={addBulkQuestion}>+ Add Another Question</button>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Adding...' : `Add ${bulkData.questions.length} Questions`}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
