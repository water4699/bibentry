"use client";

export const TestUI = () => {
  return (
    <div className="main-content">
      <div className="content-wrapper">
        <div className="title-section">
          <h1 className="main-title">
            Test UI Component
          </h1>
          <p className="main-subtitle">
            Testing if the UI loads correctly
          </p>
        </div>

        <div className="diary-form">
          <h2 className="diary-form-title">Test Form</h2>
          <p className="text-secondary mb-6 text-center">
            This is a test to see if the UI renders properly.
          </p>

          <div className="diary-form-form">
            <div className="diary-form-group">
              <label className="diary-form-label">Test Input</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter test text"
              />
            </div>

            <div className="diary-form-submit">
              <button type="button" className="btn-primary">
                Test Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
