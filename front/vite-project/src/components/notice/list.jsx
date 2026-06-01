import { useEffect, useState } from "react";

function NoticeList() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for detail modal
    const [selectedId, setSelectedId] = useState(null);
    const [detailNotice, setDetailNotice] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/notice/list")
            .then(r => {
                if (!r.ok) {
                    throw new Error("Network response was not ok");
                }
                return r.json();
            })
            .then(data => {
                setNotices(data);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setError(e.message);
                setLoading(false);
            });
    }, []);

    // Fetch notice details when clicked
    const handleNoticeClick = (id) => {
        setSelectedId(id);
        setDetailLoading(true);
        fetch(`http://localhost:8080/notice/detail/${id}`)
            .then(r => {
                if (!r.ok) {
                    throw new Error("Failed to fetch notice details");
                }
                return r.json();
            })
            .then(data => {
                setDetailNotice(data);
                setDetailLoading(false);
            })
            .catch(e => {
                console.error(e);
                setDetailLoading(false);
            });
    };

    const handleCloseModal = () => {
        setSelectedId(null);
        setDetailNotice(null);
    };

    // Format LocalDateTime string to a readable format
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="notice-container">
            <style>{`
                .notice-container {
                    width: 95%;
                    max-width: 1000px;
                    margin: 40px auto;
                    padding: 24px;
                    border-radius: 16px;
                    box-shadow: var(--shadow);
                    background: var(--bg);
                    border: 1px solid var(--border);
                    text-align: left;
                    font-family: var(--sans);
                }
                .notice-title {
                    font-size: 26px;
                    font-weight: 600;
                    color: var(--text-h);
                    margin-bottom: 24px;
                    border-bottom: 2px solid var(--accent);
                    padding-bottom: 10px;
                    display: inline-block;
                }
                .notice-message {
                    padding: 40px 20px;
                    text-align: center;
                    color: var(--text);
                    font-size: 16px;
                }
                .notice-error {
                    color: #ef4444;
                    background-color: rgba(239, 68, 68, 0.08);
                    border-radius: 8px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                .notice-table-wrapper {
                    overflow-x: auto;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .notice-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 15px;
                    color: var(--text);
                }
                .notice-table th {
                    background-color: var(--code-bg);
                    color: var(--text-h);
                    font-weight: 600;
                    padding: 16px 20px;
                    text-align: center;
                    border-bottom: 2px solid var(--border);
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .notice-table th.title-col {
                    text-align: left;
                }
                .notice-table tr {
                    border-bottom: 1px solid var(--border);
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                }
                .notice-table tr:hover {
                    background-color: var(--accent-bg);
                }
                .notice-table td {
                    padding: 16px 20px;
                    text-align: center;
                    vertical-align: middle;
                }
                .notice-table td.title-col {
                    text-align: left;
                }
                .notice-item-title {
                    font-weight: 600;
                    color: var(--text-h);
                    font-size: 16px;
                    margin-bottom: 4px;
                    transition: color 0.2s;
                }
                .notice-table tr:hover .notice-item-title {
                    color: var(--accent);
                }
                .notice-item-content {
                    font-size: 13.5px;
                    color: var(--text);
                    opacity: 0.85;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    line-height: 1.4;
                }
                .badge-id {
                    background: var(--code-bg);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-weight: bold;
                    color: var(--text-h);
                }

                /* Modal styling */
                .modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(6px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    animation: fadeIn 0.25s ease-out;
                }
                
                .modal-content {
                    background: var(--bg);
                    border: 1px solid var(--border);
                    box-shadow: var(--shadow);
                    width: 90%;
                    max-width: 600px;
                    border-radius: 20px;
                    padding: 32px;
                    position: relative;
                    text-align: left;
                    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                    max-height: 80vh;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .modal-header {
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 16px;
                    margin-bottom: 20px;
                }

                .modal-meta-row {
                    display: flex;
                    gap: 16px;
                    font-size: 13.5px;
                    color: var(--text);
                    opacity: 0.8;
                    margin-bottom: 12px;
                }

                .modal-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--text-h);
                    line-height: 1.4;
                    margin: 0;
                }

                .modal-body {
                    font-size: 15px;
                    line-height: 1.6;
                    color: var(--text);
                    overflow-y: auto;
                    flex: 1;
                    padding-right: 8px;
                    white-space: pre-wrap;
                }

                .modal-footer {
                    margin-top: 24px;
                    border-top: 1px solid var(--border);
                    padding-top: 16px;
                    display: flex;
                    justify-content: flex-end;
                }

                .close-btn {
                    background: var(--accent);
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .close-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }

                .close-btn:active {
                    transform: translateY(0);
                }

                .loading-spinner-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 0;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--border);
                    border-top: 4px solid var(--accent);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            
            <h2 className="notice-title">공지사항 목록</h2>
            
            {loading && <div className="notice-message">데이터를 불러오는 중입니다...</div>}
            
            {error && <div className="notice-message notice-error">에러가 발생했습니다: {error}</div>}
            
            {!loading && !error && notices.length === 0 && (
                <div className="notice-message">등록된 공지사항이 없습니다.</div>
            )}
            
            {!loading && !error && notices.length > 0 && (
                <div className="notice-table-wrapper">
                    <table className="notice-table">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>번호</th>
                                <th className="title-col">제목 / 내용</th>
                                <th style={{ width: "120px" }}>작성자</th>
                                <th style={{ width: "200px" }}>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((notice) => (
                                <tr key={notice.id} onClick={() => handleNoticeClick(notice.id)}>
                                    <td>
                                        <span className="badge-id">{notice.id}</span>
                                    </td>
                                    <td className="title-col">
                                        <div className="notice-item-title">{notice.title}</div>
                                        {notice.content && (
                                            <div className="notice-item-content">{notice.content}</div>
                                        )}
                                    </td>
                                    <td>{notice.author || "관리자"}</td>
                                    <td style={{ fontSize: "14px", opacity: 0.9 }}>
                                        {formatDate(notice.createAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail View Modal */}
            {selectedId && (
                <div className="modal-backdrop" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {detailLoading ? (
                            <div className="loading-spinner-wrapper">
                                <div className="spinner"></div>
                            </div>
                        ) : detailNotice ? (
                            <>
                                <div className="modal-header">
                                    <div className="modal-meta-row">
                                        <span><strong>번호:</strong> {detailNotice.id}</span>
                                        <span>|</span>
                                        <span><strong>작성자:</strong> {detailNotice.author || "관리자"}</span>
                                        <span>|</span>
                                        <span><strong>등록일:</strong> {formatDate(detailNotice.createAt)}</span>
                                    </div>
                                    <h3 className="modal-title">{detailNotice.title}</h3>
                                </div>
                                <div className="modal-body">
                                    {detailNotice.content}
                                </div>
                            </>
                        ) : (
                            <div className="notice-message notice-error">상세 정보를 불러올 수 없습니다.</div>
                        )}
                        <div className="modal-footer">
                            <button className="close-btn" onClick={handleCloseModal}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoticeList;
