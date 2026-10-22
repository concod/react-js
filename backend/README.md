# Python / Backend Practice

Separate from the React app — just a learning space, same style as `src/problems/`
(predict-the-output + fill-in-the-blank drills, run directly, check against the answer
comment).

## Setup

```bash
cd backend
python -m venv venv           # Windows: python (not python3)
# macOS/Linux: python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Suggested order

1. `01_basics.py` — syntax, data structures, comprehensions, output-prediction (the
   Python analogues of the JS gotchas you already know: mutable default args,
   late-binding closures, `is` vs `==`)
2. `02_oop.py` — classes, dunder methods, decorators (not written yet — ask when ready)
3. `03_fastapi/` — a minimal FastAPI app with a couple routes (matches your resume's
   "reporting APIs" experience)
4. `04_sqlalchemy/` — async SQLAlchemy models + a query or two

Run any file directly:
```bash
python backend/01_basics.py   # Windows: python  (python3 is often a Store stub)
```
