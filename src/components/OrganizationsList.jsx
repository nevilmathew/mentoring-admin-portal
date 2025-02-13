import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, ArrowDown, ShieldMinus, UserCog } from 'lucide-react'

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        Previous
      </Button>
      {pageNumbers.map(number => (
        <Button
          key={number}
          variant={currentPage === number ? 'default' : 'outline'}
          onClick={() => onPageChange(number)}>
          {number}
        </Button>
      ))}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        Next
      </Button>
    </div>
  )
}

// Organizations List Component
const OrganizationsList = ({
  listOrgOpen,
  setListOrgOpen,
  setCreateOrgOpen,
  onViewDetails,
  onActAsOrgAdmin,
  listOrganizations, // API function to list organizations
}) => {
  const [organizations, setOrganizations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch Organizations
  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await listOrganizations(currentPage, rowsPerPage)

      if (response.responseCode === 'OK') {
        const organizationsData = response.result.data

        // Use functional update to ensure state is set correctly
        setOrganizations(prev => {
          // Only update if the data has actually changed
          const isDataChanged = JSON.stringify(prev) !== JSON.stringify(organizationsData)
          return isDataChanged ? organizationsData : prev
        })

        // Calculate total pages
        const totalCount = response.result.count
        setTotalPages(Math.ceil(totalCount / rowsPerPage))
      } else {
        throw new Error(response.message || 'Failed to fetch organizations')
      }
    } catch (error) {
      console.error('Failed to fetch organizations', error)
      setError(error.message)
      setOrganizations([])
    } finally {
      // Use a small timeout to smooth out the loading state
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
  }, [listOrganizations, currentPage, rowsPerPage])

  // Search and Filter Organizations
  const filteredOrganizations = organizations.filter(
    org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Effect to fetch organizations
  useEffect(() => {
    if (listOrgOpen) {
      fetchOrganizations()
    }
  }, [listOrgOpen, currentPage, rowsPerPage, fetchOrganizations])

  // Optimize rows per page change
  const handleRowsPerPageChange = useCallback(value => {
    // Reset to first page when changing page size
    setCurrentPage(1)

    // Use Number to ensure it's a number
    setRowsPerPage(Number(value))
  }, [])

  // Page change handler
  const handlePageChange = page => {
    setCurrentPage(page)
  }

  // Render loading state
  if (isLoading) {
    return (
      <Dialog open={listOrgOpen} onOpenChange={setListOrgOpen}>
        <DialogContent>
          <div className="text-center">Loading organizations...</div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render error state
  if (error) {
    return (
      <Dialog open={listOrgOpen} onOpenChange={setListOrgOpen}>
        <DialogContent>
          <div className="text-center text-red-500">{error}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={listOrgOpen} onOpenChange={setListOrgOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Organizations</DialogTitle>
        </DialogHeader>

        {/* Search and Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search organizations..."
              className="w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />

            {/* Page Size Selector */}
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder={`${rowsPerPage} rows`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add New Organization Button */}
          <Button onClick={() => setCreateOrgOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Organizations Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations.length > 0 ? (
              filteredOrganizations.map(org => (
                <TableRow key={org.id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.code}</TableCell>
                  <TableCell>{org.description || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(org)}
                      title="Deactivate Organization">
                      <ShieldMinus className="h-4 w-4 text-red-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onActAsOrgAdmin(org)}
                      title="Act as Organization Admin">
                      <UserCog className="text-gray-600 hover:text-blue-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No organizations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationsList
