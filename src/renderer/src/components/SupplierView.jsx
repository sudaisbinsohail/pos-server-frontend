import React, { useRef, useState, useEffect } from 'react'
import ButtonFeild from './ButtonFeild'
export default function SupplierView({ supplier }) {
  const printRef = useRef()
  const [imagePreview, setImagePreview] = useState(null)

  // Load image preview on mount or when supplier changes
  useEffect(() => {
    const loadImage = async () => {
      if (supplier?.imageUrl) {
        try {
          const base64 = await window.api.readImageBase64(supplier.imageUrl)
          setImagePreview(base64)
        } catch (err) {
          console.error('Failed to load supplier image', err)
          setImagePreview(null)
        }
      } else {
        setImagePreview(null)
      }
    }
    loadImage()
  }, [supplier])

  const handlePrint = () => {
    const hideElements = document.body.children

    Array.from(hideElements).forEach((el) => {
      if (el !== printRef.current) el.style.display = 'none'
    })

    window.print()

    Array.from(hideElements).forEach((el) => {
      el.style.display = ''
    })
  }

  if (!supplier) return <p>No supplier selected</p>

  return (
    <div className="p-6   w-full max-w-3xl">
      <div ref={printRef} className="bg-white p-5 ">
        <h2 className="text-2xl font-bold mb-6">Supplier Details</h2>

        {/* Supplier Image */}
        <div className="mb-6 flex justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={supplier.supplierName}
              className="w-32 h-32 object-cover rounded border"
            />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center border rounded text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Supplier Fields */}
        <div className="grid grid-cols-2 gap-6 text-gray-700">
          <div>
            <strong>Name:</strong> {supplier.supplierName ?? '-'}
          </div>
          <div>
            <strong>Email:</strong> {supplier.email ?? '-'}
          </div>
          <div>
            <strong>Phone:</strong> {supplier.phone ?? '-'}
          </div>
          <div>
            <strong>Mobile:</strong> {supplier.mobile ?? '-'}
          </div>
          <div>
            <strong>Country:</strong> {supplier.country ?? '-'}
          </div>
          <div>
            <strong>State:</strong> {supplier.state ?? '-'}
          </div>
          <div>
            <strong>City:</strong> {supplier.city ?? '-'}
          </div>
          <div>
            <strong>Zip Code:</strong> {supplier.zipCode ?? '-'}
          </div>
          <div>
            <strong>Currency:</strong> {supplier.currency ?? '-'}
          </div>
          <div>
            <strong>Tax ID:</strong> {supplier.taxId ?? '-'}
          </div>
          <div>
            <strong>Payment Terms:</strong> {supplier.paymentTerms ?? '-'}
          </div>
          <div>
            <strong>Status:</strong> {supplier.status ? 'Active' : 'Disabled'}
          </div>

          {/* Address full width */}
          <div className="col-span-2">
            <label className="font-bold block mb-1">Address:</label>
            <div className="max-h-40 overflow-y-auto break-words p-3 border rounded bg-gray-50">
              {supplier.address ?? '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-4">
        <ButtonFeild onClick={handlePrint} label="Print Supplier Details" />
      </div>
    </div>
  )
}
