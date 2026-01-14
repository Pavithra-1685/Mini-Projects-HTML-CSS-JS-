# 📝 Notes App (Vanilla JavaScript)

A simple and efficient **Notes Application** built using **Vanilla JavaScript**, designed to demonstrate core frontend concepts such as DOM manipulation, state management, and browser storage using **LocalStorage**.

This project is beginner-friendly and focuses on writing clean, understandable logic without relying on external libraries or frameworks.

---

## 🚀 Features

* ✏️ Create, edit, and delete notes
* 💾 Auto-save notes using **LocalStorage**
* 🔍 Real-time search (by title and content)
* 🕒 Relative timestamps ("Just now", "5 min ago", etc.)
* 📌 Active note highlighting
* ♻️ Persistent data even after page refresh

---

## 🛠️ Tech Stack

* **HTML** – Structure
* **CSS** – Styling
* **JavaScript (Vanilla JS)** – Logic & interactivity
* **LocalStorage** – Data persistence

---

## 📂 Project Structure

```
notes-app/
│
├── index.html
├── style.css
└── script.js
```

---

## ⚙️ How It Works

* Notes are stored in the browser using `localStorage`
* Each note has:

  * `id`
  * `title`
  * `content`
  * `createdAt`
  * `updatedAt`
* The app tracks the currently selected note using `activeNoteId`
* UI updates dynamically based on user interaction

---

## 📥 How to Run Locally

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/notes-app.git
   ```

2. Navigate to the project folder

   ```bash
   cd notes-app
   ```

3. Open `index.html` in your browser

That’s it! 🎉

---

## 🌱 Learning Outcomes

* Understanding DOM manipulation
* Managing application state in JavaScript
* Using LocalStorage for persistence
* Writing modular and readable functions
* Improving UX with small details

---

## 🙌 Future Improvements

* Markdown support for notes
* Dark mode
* Sorting notes by date
* Export notes feature

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome! Feel free to fork this repository and improve it.

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

### ⭐ If you found this project helpful, consider giving star
