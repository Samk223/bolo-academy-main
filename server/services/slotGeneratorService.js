import pool from "../db.js";

export async function generateSlotsIfMissing() {
    // Check if future slots already exist
    const { rows } = await pool.query(`
    SELECT COUNT(*) 
    FROM time_slots 
    WHERE slot_date >= CURRENT_DATE
  `);

    if (Number(rows[0].count) > 0) return;

    console.log(" Generating slots automatically...");

    const DAYS_AHEAD = 7; // one week
    const START_HOUR = 12; // 12 PM
    const END_HOUR = 18;   // 6 PM

    for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset++) {
        const dateRes = await pool.query(
            `SELECT (CURRENT_DATE + $1)::date AS d`,
            [dayOffset]
        );


        const slotDate = dateRes.rows[0].d;
        const dayName = new Date(slotDate).getDay();

        // Skip Sunday (0 = Sunday)
        if (dayName === 0) continue;

        let hour = START_HOUR;

        while (hour + 0.5 <= END_HOUR) {
            const start = `${String(hour).padStart(2, "0")}:00`;
            const end = `${String(hour).padStart(2, "0")}:30`;

            await pool.query(
                `
        INSERT INTO time_slots (slot_date, start_time, end_time)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
        `,
                [slotDate, start, end]
            );

            hour += 1.5; // 30 min slot + 1 hour gap
        }
    }

    console.log(" Slots generated successfully");
}
