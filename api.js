async function getAllRows() {
  const { data, error } = await supabase
    .from("consolidation")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

async function getFilteredRows({ from, to, machine, engineer }) {
  let query = supabase.from("consolidation").select("*");

  if (from) query = query.gte("date", from);
  if (to) query = query.lte("date", to);
  if (machine) query = query.ilike("machine_no", `%${machine}%`);
  if (engineer) query = query.ilike("engineer_name", `%${engineer}%`);

  const { data, error } = await query.order("date", { ascending: false });

  if (error) throw error;
  return data;
}

async function updatePassedAmount(rows) {
  const { error } = await supabase
    .from("consolidation")
    .upsert(rows, { onConflict: "unique_key" });

  if (error) throw error;
}

async function deleteRow(unique_key) {
  const { error } = await supabase
    .from("consolidation")
    .delete()
    .eq("unique_key", unique_key);

  if (error) throw error;
}
