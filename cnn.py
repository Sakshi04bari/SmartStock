import random
import numpy as np
import tensorflow as tf
from tensorflow.keras import datasets
from PIL import Image, ImageTk, ImageOps
import tkinter as tk
from tkinter import ttk
import tkinter.font as tkFont

# -------------------------
# Load trained CNN model
# -------------------------
model = tf.keras.models.load_model("cnn_mnist_model.h5")

# Load MNIST test dataset
(_, _), (x_test, y_test) = datasets.mnist.load_data()

# Normalize & reshape for CNN
x_test_norm = x_test / 255.0
x_test_norm = x_test_norm.reshape(-1, 28, 28, 1)


# -------------------------
# UI helpers and prediction
# -------------------------
current_idx = 0

def predict_index(idx):
    probs = model.predict(x_test_norm[idx:idx+1], verbose=0)[0]
    top3 = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)[:3]
    return probs, top3

def show_image(idx):
    global current_idx
    current_idx = idx % len(x_test)
    img = x_test[current_idx]
    true_label = int(y_test[current_idx])

    # prepare image for display (grayscale, resized)
    pil = Image.fromarray(img)
    pil = ImageOps.grayscale(pil).resize((220, 220), Image.NEAREST)
    img_tk = ImageTk.PhotoImage(pil)

    image_label.config(image=img_tk)
    image_label.image = img_tk

    probs, top3 = predict_index(current_idx)

    # update top prediction and probability bars
    pred_label_val = int(top3[0][0])
    pred_conf = probs[pred_label_val]
    main_prediction.config(text=f"Predicted: {pred_label_val}  ({pred_conf:.2%})")
    actual_label.config(text=f"Actual: {true_label}")

    for i in range(10):
        pct = probs[i]
        prob_bars[i]['value'] = pct * 100
        prob_labels[i].config(text=f"{i}: {pct:.2%}")

    status_var.set(f"Index: {current_idx} — Use ← → or buttons to navigate")

def show_next():
    show_image(current_idx + 1)

def show_prev():
    show_image(current_idx - 1)

def on_key(event):
    if event.keysym in ("Right", "n"):
        show_next()
    elif event.keysym in ("Left", "p"):
        show_prev()


# -------------------------
# Build Tkinter UI (polished)
# -------------------------
root = tk.Tk()
root.title("CNN Digit Recognition — MNIST Viewer")
root.geometry("700x420")

style = ttk.Style(root)
try:
    style.theme_use('clam')
except Exception:
    pass
style.configure('Title.TLabel', font=('Segoe UI', 16, 'bold'))
style.configure('TFrame', background='#f3f4f6')
root.configure(background='#f3f4f6')

title = ttk.Label(root, text='CNN Digit Prediction UI', style='Title.TLabel')
title.pack(pady=(10, 4))

main_frame = ttk.Frame(root, padding=12)
main_frame.pack(fill='both', expand=True)

# Left: image
left = ttk.Frame(main_frame)
left.grid(row=0, column=0, sticky='nw')

img_border = tk.Frame(left, bd=2, relief='ridge')
img_border.pack()
image_label = ttk.Label(img_border)
image_label.pack(padx=6, pady=6)

# Right: predictions
right = ttk.Frame(main_frame)
right.grid(row=0, column=1, padx=20, sticky='ne')

main_prediction = ttk.Label(right, text='Predicted: —', font=('Segoe UI', 14, 'bold'))
main_prediction.pack(anchor='w')
actual_label = ttk.Label(right, text='Actual: —', font=('Segoe UI', 12))
actual_label.pack(anchor='w', pady=(2, 8))

probs_frame = ttk.Frame(right)
probs_frame.pack(fill='x')

# create 10 progress bars and labels
prob_bars = []
prob_labels = []
for i in range(10):
    row = ttk.Frame(probs_frame)
    row.pack(fill='x', pady=2)
    lbl = ttk.Label(row, text=f"{i}: 0.00%", width=8)
    lbl.pack(side='left')
    bar = ttk.Progressbar(row, length=180)
    bar.pack(side='left', padx=(6, 0))
    prob_labels.append(lbl)
    prob_bars.append(bar)

# Controls
controls = ttk.Frame(root)
controls.pack(pady=8)
prev_btn = ttk.Button(controls, text='Previous', command=show_prev)
prev_btn.grid(row=0, column=0, padx=6)
next_btn = ttk.Button(controls, text='Next', command=show_next)
next_btn.grid(row=0, column=1, padx=6)
random_btn = ttk.Button(controls, text='Random', command=lambda: show_image(random.randint(0, len(x_test)-1)))
random_btn.grid(row=0, column=2, padx=6)

# Status bar
status_var = tk.StringVar()
status_bar = ttk.Label(root, textvariable=status_var, relief='sunken', anchor='w')
status_bar.pack(fill='x', side='bottom')

root.bind('<Key>', on_key)

# Initialize prediction values
for b in prob_bars:
    b['maximum'] = 100

show_image(random.randint(0, len(x_test)-1))

root.mainloop()
