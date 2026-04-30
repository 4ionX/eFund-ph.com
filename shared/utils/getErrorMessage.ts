export const getErrorMessage = (err: any) => {
  // 1. Apollo / GraphQL style
  if (err?.response?.data?.errors?.length) {
    return err.response.data.errors[0]?.message;
  }

  // 2. Supabase GraphQL raw body string (IMPORTANT FIX)
  if (err?.response?.body) {
    try {
      const parsed = JSON.parse(err.response.body);
      return parsed?.errors?.[0]?.message;
    } catch (e) {
      return err.response.body;
    }
  }

  // 3. fetch / generic GraphQL
  if (err?.errors?.length) {
    return err.errors[0]?.message;
  }

  // 4. normal JS error
  if (err?.message) return err.message;

  return "Something went wrong";
};
