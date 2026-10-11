"""
Evaluation metrics helper using scikit-learn.
Evaluates category accuracy, per-attribute precision/recall/F1 on held-out test splits.
"""
from typing import List, Dict, Any
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report

def evaluate_categories(y_true: List[str], y_pred: List[str]) -> Dict[str, Any]:
    acc = accuracy_score(y_true, y_pred)
    p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="macro", zero_division=0)
    report = classification_report(y_true, y_pred, output_dict=True, zero_division=0)
    return {
        "accuracy": float(acc),
        "macro_precision": float(p),
        "macro_recall": float(r),
        "macro_f1": float(f1),
        "detailed_report": report,
    }

def evaluate_attributes(y_true_dict: Dict[str, List[str]], y_pred_dict: Dict[str, List[str]]) -> Dict[str, Any]:
    results = {}
    f1_scores = []
    for attr, y_true in y_true_dict.items():
        if attr in y_pred_dict:
            y_pred = y_pred_dict[attr]
            p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="macro", zero_division=0)
            results[attr] = {
                "precision": float(p),
                "recall": float(r),
                "f1": float(f1),
            }
            f1_scores.append(f1)
    
    macro_avg_f1 = sum(f1_scores) / len(f1_scores) if f1_scores else 0.0
    return {
        "attributes": results,
        "macro_average_attribute_f1": float(macro_avg_f1),
    }
