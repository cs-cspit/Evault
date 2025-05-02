 {/* Case Documents Section with role-specific features */}
           {/* Case Documents Section with role-specific features */}
<div className="mb-12">
  <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
    <h2 className={`text-3xl font-bold text-black`}>
      Case Documents
    </h2>
    
    {/* Upload Button - Always visible for lawyers */}
    {userTypeFromUrl === "lawyer" && (
      <Dialog
        open={uploadDocumentDialogBoxIsOpen}
        onOpenChange={setUploadDocumentDialogBoxIsOpen}
      >
        {/* ... (upload dialog content remains the same) ... */}
      </Dialog>
    )}
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {caseDetails.caseDocumentHash.length > 0 ? (
      caseDetails.caseDocumentHash.map((imageUrl, index) => {
        const fullImageUrl = `https://gateway.pinata.cloud/ipfs/${imageUrl}`;
        
        return (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div
                className="group relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={fullImageUrl}
                    alt={`Document ${index + 1}`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className={`p-4 bg-gradient-to-t ${
                  isUserJudge 
                    ? "from-purple-900/50"
                    : isUserLawyer
                    ? "from-emerald-900/50"
                    : "from-amber-900/50"
                } to-transparent absolute bottom-0 left-0 right-0 text-white`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm opacity-75">
                      {superShortenWalletAddress(caseDetails.caseDocumentUploader[index])}
                    </span>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-0 max-w-4xl mx-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-black">
                  Document Details
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Uploaded by {superShortenWalletAddress(caseDetails.caseDocumentUploader[index])}
                </DialogDescription>
              </DialogHeader>
              <div className="w-full max-h-[70vh] flex items-center justify-center">
                <img
                  src={fullImageUrl}
                  alt={`Document ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <DialogFooter>
                <a 
                  href={fullImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Open in Full Size
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })
    ) : (
      <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-200">
        <svg className={`w-16 h-16 mb-4 ${
          isUserJudge 
            ? "text-purple-400"
            : isUserLawyer
            ? "text-emerald-400"
            : "text-amber-400"
        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No documents yet</p>
        <p className="text-gray-400 text-sm mt-1">Upload case documents to get started</p>
      </div>
    )}
  </div>
</div>