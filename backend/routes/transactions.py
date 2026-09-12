from datetime import datetime
from collections import defaultdict

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Transaction

transactions_bp = Blueprint("transactions", __name__)


def _parse_date(value):
    return datetime.strptime(value, "%Y-%m-%d").date()


@transactions_bp.get("/")
@jwt_required()
def list_transactions():
    user_id = int(get_jwt_identity())
    month = request.args.get("month")  # format: YYYY-MM

    query = Transaction.query.filter_by(user_id=user_id)
    if month:
        year, mon = month.split("-")
        query = query.filter(
            db.extract("year", Transaction.date) == int(year),
            db.extract("month", Transaction.date) == int(mon),
        )

    items = query.order_by(Transaction.date.desc()).all()
    return jsonify([t.to_dict() for t in items])


@transactions_bp.post("/")
@jwt_required()
def create_transaction():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    try:
        txn = Transaction(
            user_id=user_id,
            type=data["type"],
            amount=float(data["amount"]),
            category=data["category"],
            note=data.get("note", ""),
            date=_parse_date(data["date"]),
        )
    except (KeyError, ValueError):
        return jsonify({"error": "Missing or invalid fields."}), 400

    if txn.type not in ("income", "expense"):
        return jsonify({"error": "type must be 'income' or 'expense'."}), 400

    db.session.add(txn)
    db.session.commit()
    return jsonify(txn.to_dict()), 201


@transactions_bp.put("/<int:txn_id>")
@jwt_required()
def update_transaction(txn_id):
    user_id = int(get_jwt_identity())
    txn = Transaction.query.filter_by(id=txn_id, user_id=user_id).first()
    if not txn:
        return jsonify({"error": "Transaction not found."}), 404

    data = request.get_json() or {}
    if "type" in data:
        txn.type = data["type"]
    if "amount" in data:
        txn.amount = float(data["amount"])
    if "category" in data:
        txn.category = data["category"]
    if "note" in data:
        txn.note = data["note"]
    if "date" in data:
        txn.date = _parse_date(data["date"])

    db.session.commit()
    return jsonify(txn.to_dict())


@transactions_bp.delete("/<int:txn_id>")
@jwt_required()
def delete_transaction(txn_id):
    user_id = int(get_jwt_identity())
    txn = Transaction.query.filter_by(id=txn_id, user_id=user_id).first()
    if not txn:
        return jsonify({"error": "Transaction not found."}), 404

    db.session.delete(txn)
    db.session.commit()
    return "", 204


@transactions_bp.get("/summary")
@jwt_required()
def summary():
    """Returns totals by category and a month-by-month trend, for the charts."""
    user_id = int(get_jwt_identity())
    items = Transaction.query.filter_by(user_id=user_id).all()

    by_category = defaultdict(float)
    by_month = defaultdict(lambda: {"income": 0.0, "expense": 0.0})

    for t in items:
        if t.type == "expense":
            by_category[t.category] += t.amount
        month_key = t.date.strftime("%Y-%m")
        by_month[month_key][t.type] += t.amount

    return jsonify(
        {
            "by_category": [
                {"category": k, "total": v} for k, v in by_category.items()
            ],
            "by_month": [
                {"month": k, "income": v["income"], "expense": v["expense"]}
                for k, v in sorted(by_month.items())
            ],
        }
    )
