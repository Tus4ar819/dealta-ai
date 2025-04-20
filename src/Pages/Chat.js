import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api';

export default function Chat() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  const sendQuery = async () => {
    if (!query.trim()) return;
    setMessages(prev => [
      ...prev,
      { type: 'user', text: query },
      { type: 'bot', isThinking: true }
    ]);

    try {
      const { data } = await api.post('/api/chat', { queries: [query] });

      const botReplies = Object.values(data).map(item => {
        // Handle vector_search_value special case at the top level
        if (item.vector_search_value && item.schema_names && item.name) {
          return {
            type: 'bot',
            vector_search: true,
            schema_names: item.schema_names,
            vector_search_value: item.vector_search_value,
            name: item.name
          };
        }
        // Handle vector_query_value special case at the top level
        if (item.vector_result && item.vector_result.vector_query_value && item.vector_result.vector_field && item.vector_result.name) {
          return {
            type: 'bot',
            vector: true,
            vector_result: item.vector_result
          };
        }
        const err = item.employee_data?.error;
        const arr = item.result;
        if (err) {
          return { type: 'bot', context: item.context, schema_name: item.schema_name, error: err };
        } else if (Array.isArray(arr)) {
          return { type: 'bot', context: item.context, schema_name: item.schema_name, dataArray: arr };
        } else {
          return {
            type: 'bot',
            context: item.context,
            schema_name: item.schema_name,
            data: item.employee_data?.data ?? {}
          };
        }
      });

      setMessages(prev => [
        ...prev.filter(m => !m.isThinking),
        ...botReplies
      ]);
      setQuery('');
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev.filter(m => !m.isThinking),
        { type: 'bot', error: 'Error fetching response.' }
      ]);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // title‑case function
  const toTitle = s =>
    s
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ maxWidth: 600, width: '100%' }}>
        <h2 className="text-center mb-4">Multi-Query Chat App</h2>
        <div className="alert alert-warning text-center">
          Please verify all information before making decisions.
        </div>
        <div className="card" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <div className="card-body flex-grow-1 overflow-auto">
            {messages.length === 0 && (
              <div className="text-center text-muted">No messages yet.</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className="d-flex mb-3 align-items-start">
                {msg.type === 'bot' ? (
                  <>
                    <i className="bi bi-chat-dots-fill fs-3 me-2"></i>
                    <div className="bg-light p-2 rounded" style={{ maxWidth: '70%' }}>
                      {msg.isThinking ? (
                        'Bot is thinking...'
                      ) : msg.error ? (
                        <span className="text-danger">Error: {msg.error}</span>
                      ) : msg.vector_search ? (
                        <>
                          The <b>{Array.isArray(msg.schema_names) ? msg.schema_names.join(', ') : msg.schema_names}</b> is <b>{msg.vector_search_value}</b> belong to <b>{msg.name}</b>
                        </>
                      ) : msg.vector ? (
                        (() => {
                          const obj = msg.vector_result;
                          return (
                            <>
                              For <b>{obj.name}</b>, the <b>{toTitle(obj.vector_field)}</b> is <b>{obj.vector_query_value}</b>.<br />
                              {Object.entries(obj)
                                .filter(([k]) => !['_embedding','vector_query_value','vector_field','name'].includes(k) && !k.includes('_embedding'))
                                .map(([k, v]) => (
                                  <span key={k}>
                                    {toTitle(k)}: <b>{v}</b>
                                    <br />
                                  </span>
                                ))}
                            </>
                          );
                        })()
                      ) : Array.isArray(msg.dataArray) ? (
                        <>
                          <ul className="list-unstyled mb-2">
                            {msg.dataArray.map((rec, idx) => (
                              <li key={idx}>
                                <strong>{idx + 1}.</strong>
                                <br />
                                {Object.entries(rec)
                                  .filter(([k]) => !k.includes('_embedding'))
                                  .map(([k, v]) => (
                                    <span key={k}>
                                      {toTitle(k)}: <b>{v}</b>
                                      <br />
                                    </span>
                                  ))}
                              </li>
                            ))}
                          </ul>
                          <div><em>Total {msg.dataArray.length} employees.</em></div>
                        </>
                      ) : (
                        (() => {
                          const obj = msg.data || {};
                          // Handle vector_query_value special case
                          if (obj.vector_query_value && obj.vector_field && obj.name) {
                            return (
                              <>
                                {`For ${obj.name}, the ${toTitle(obj.vector_field)} is `}
                                <b>{obj.vector_query_value}</b>.
                                <br />
                                {/* Show all other fields except _embedding, vector_query_value, vector_field, name */}
                                {Object.entries(obj)
                                  .filter(([k]) => !['_embedding','vector_query_value','vector_field','name'].includes(k) && !k.includes('_embedding'))
                                  .map(([k, v]) => (
                                    <span key={k}>
                                      {toTitle(k)}: <b>{v}</b>
                                      <br />
                                    </span>
                                  ))}
                              </>
                            );
                          }
                          const ks = Object.keys(obj).filter(k => !k.includes('_embedding'));
                          if (!ks.length) {
                            return null;
                          }
                          if (ks.length === 1) {
                            const k0 = ks[0];
                            return (
                              <>
                                For {msg.context}, the {msg.schema_name} is <b>{obj[k0]}</b>.
                              </>
                            );
                          }
                          return (
                            <>
                              {`For ${msg.context}, the details are:`}
                              <br />
                              {ks.map((key, idx) => (
                                <span key={key}>
                                  {toTitle(key)}: <b>{obj[key]}</b>
                                  <br />
                                </span>
                              ))}
                            </>
                          );
                        })()
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-primary text-white p-2 rounded ms-auto" style={{ maxWidth: '70%' }}>
                      {msg.text}
                    </div>
                    <i className="bi bi-person-fill fs-3 ms-2"></i>
                  </>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type your query..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendQuery()}
              />
              <button className="btn btn-primary" onClick={sendQuery}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
