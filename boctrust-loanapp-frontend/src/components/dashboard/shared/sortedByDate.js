 const sortByCreatedAt = (list) => {
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
  
export default sortByCreatedAt;