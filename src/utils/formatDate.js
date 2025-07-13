const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate(); // no leading zero
  const month = date.getMonth() + 1; // no leading zero
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default formatDate;