class SearchController {
  // Tìm kiếm theo hạng mục và giá trị:
  async search(req, res) {
    const { selectedCategory, searchValue } = req.body;

    const result = await Books.findAll({
      where: { [selectedCategory]: searchValue },
    });

    res.json(result);
  }
}

module.exports = new SearchController();
