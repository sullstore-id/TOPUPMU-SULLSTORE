export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
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

    const message = `
🛒 <b>PESANAN BARU SULLSTORE</b>

🧾 <b>Invoice:</b> ${orderCode || "-"}
🎮 <b>Produk:</b> ${game || "-"}
📦 <b>Item:</b> ${item || "-"}
💰 <b>Total:</b> ${total || "-"}

👤 <b>Pembeli:</b> ${customerName || "-"}
🆔 <b>User ID:</b> ${userId || "-"}
🌐 <b>Server:</b> ${server || "-"}
💳 <b>Payment:</b> ${payment || "-"}

📌 <b>Status:</b> ${status || "-"}

${paymentProofUrl ? `📷 <b>Bukti Bayar:</b>\n${paymentProofUrl}` : ""}
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML"
        })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      return res.status(500).json({
        success: false,
        message: "Gagal kirim Telegram",
        telegramData
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notifikasi Telegram terkirim"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    });
  }
}
