export function store(payload) {
  try {

    fetch('https://voluspa-a.braytech.org/member/store', {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

  } catch (e) {

  }
}
