export const postUploadsController = async (req, res) => {
  console.log(req.file);
  const finalUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

  res.json({
    status: "success",
    data: {
      fileUrl: finalUrl,
    },
  });
};
