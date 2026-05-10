// api/telegram-order.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const {
      orderCode,
      game,
      item,
      total,
      customerName,
      userId,
      server,
      payment,
      status,
      paymentProofUrl
    } = req.body;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({
        success: false,
        message: "Telegram env belum disetting"
      });
    }

    const text = `
🛒 *PESANAN BARU SULLSTORE*

🧾 *Invoice:* ${orderCode || "-"}
🎮 *Produk:* ${game || "-"}
📦 *Item:* ${item || "-"}
💰 *Total:* ${total || "-"}

👤 *Pembeli:* ${customerName || "Guest"}
🆔 *User ID:* ${userId || "-"}
🌐 *Server:* ${server || "-"}
💳 *Payment:* ${payment || "-"}

📌 *Status:* ${status || "Menunggu Verifikasi Pembayaran"}

📷 *Bukti Bayar:*
${paymentProofUrl || "-"}
`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown"
      })
    });

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      return res.status(500).json({
        success: false,
        message: "Gagal kirim ke Telegram",
        telegramData
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notif Telegram terkirim"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
