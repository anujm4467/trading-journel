import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { z } from 'zod'

// Validation schema for settings
const settingsSchema = z.object({
  category: z.enum(['GENERAL', 'DISPLAY', 'TABLE', 'EXPORT', 'BACKUP']),
  data: z.record(z.string(), z.unknown())
})

// GET /api/settings - Get all settings
export async function GET() {
  try {
    const settings = await prisma.appSettings.findFirst()

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.appSettings.create({
        data: {
          defaultInstrument: 'EQUITY',
          defaultPosition: 'BUY',
          autoCalculateCharges: true,
          requireStrategyTag: false,
          currencySymbol: '₹',
          decimalPlaces: 2,
          thousandsSeparator: 'comma',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24',
          theme: 'light',
          defaultPageSize: 50,
          denseMode: false,
          zebraStriping: true,
          stickyHeaders: true,
          autoRefresh: true,
          defaultExportFormat: 'excel',
          includeFilters: true,
          includeCharts: true,
          fileNamingTemplate: 'TradeJournal_YYYY-MM-DD',
          keepTradeHistory: 'forever',
          autoBackupFrequency: 'weekly'
        }
      })
      
      return NextResponse.json({
        success: true,
        data: {
          GENERAL: {
            defaultInstrument: defaultSettings.defaultInstrument,
            defaultPosition: defaultSettings.defaultPosition,
            defaultLotSize: defaultSettings.defaultLotSize,
            autoCalculateCharges: defaultSettings.autoCalculateCharges,
            requireStrategyTag: defaultSettings.requireStrategyTag
          },
          DISPLAY: {
            currencySymbol: defaultSettings.currencySymbol,
            decimalPlaces: defaultSettings.decimalPlaces,
            thousandsSeparator: defaultSettings.thousandsSeparator,
            dateFormat: defaultSettings.dateFormat,
            timeFormat: defaultSettings.timeFormat,
            theme: defaultSettings.theme
          },
          TABLE: {
            defaultPageSize: defaultSettings.defaultPageSize,
            denseMode: defaultSettings.denseMode,
            zebraStriping: defaultSettings.zebraStriping,
            stickyHeaders: defaultSettings.stickyHeaders,
            autoRefresh: defaultSettings.autoRefresh
          },
          EXPORT: {
            defaultExportFormat: defaultSettings.defaultExportFormat,
            includeFilters: defaultSettings.includeFilters,
            includeCharts: defaultSettings.includeCharts,
            fileNamingTemplate: defaultSettings.fileNamingTemplate
          },
          BACKUP: {
            keepTradeHistory: defaultSettings.keepTradeHistory,
            autoBackupFrequency: defaultSettings.autoBackupFrequency
          }
        }
      })
    }

    // Convert settings to grouped format
    const groupedSettings: Record<string, Record<string, unknown>> = {
      GENERAL: {
        defaultInstrument: settings.defaultInstrument,
        defaultPosition: settings.defaultPosition,
        defaultLotSize: settings.defaultLotSize,
        autoCalculateCharges: settings.autoCalculateCharges,
        requireStrategyTag: settings.requireStrategyTag
      },
      DISPLAY: {
        currencySymbol: settings.currencySymbol,
        decimalPlaces: settings.decimalPlaces,
        thousandsSeparator: settings.thousandsSeparator,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        theme: settings.theme
      },
      TABLE: {
        defaultPageSize: settings.defaultPageSize,
        denseMode: settings.denseMode,
        zebraStriping: settings.zebraStriping,
        stickyHeaders: settings.stickyHeaders,
        autoRefresh: settings.autoRefresh
      },
      EXPORT: {
        defaultExportFormat: settings.defaultExportFormat,
        includeFilters: settings.includeFilters,
        includeCharts: settings.includeCharts,
        fileNamingTemplate: settings.fileNamingTemplate
      },
      BACKUP: {
        keepTradeHistory: settings.keepTradeHistory,
        autoBackupFrequency: settings.autoBackupFrequency
      }
    }

    return NextResponse.json({
      success: true,
      data: groupedSettings
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings - Update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, data } = settingsSchema.parse(body)

    // Map category data to AppSettings fields
    const updateData: Record<string, unknown> = {}
    
    if (category === 'GENERAL') {
      if (data.defaultInstrument) updateData.defaultInstrument = data.defaultInstrument
      if (data.defaultPosition) updateData.defaultPosition = data.defaultPosition
      if (data.defaultLotSize) updateData.defaultLotSize = data.defaultLotSize
      if (typeof data.autoCalculateCharges === 'boolean') updateData.autoCalculateCharges = data.autoCalculateCharges
      if (typeof data.requireStrategyTag === 'boolean') updateData.requireStrategyTag = data.requireStrategyTag
    } else if (category === 'DISPLAY') {
      if (data.currencySymbol) updateData.currencySymbol = data.currencySymbol
      if (typeof data.decimalPlaces === 'number') updateData.decimalPlaces = data.decimalPlaces
      if (data.thousandsSeparator) updateData.thousandsSeparator = data.thousandsSeparator
      if (data.dateFormat) updateData.dateFormat = data.dateFormat
      if (data.timeFormat) updateData.timeFormat = data.timeFormat
      if (data.theme) updateData.theme = data.theme
    } else if (category === 'TABLE') {
      if (typeof data.defaultPageSize === 'number') updateData.defaultPageSize = data.defaultPageSize
      if (typeof data.denseMode === 'boolean') updateData.denseMode = data.denseMode
      if (typeof data.zebraStriping === 'boolean') updateData.zebraStriping = data.zebraStriping
      if (typeof data.stickyHeaders === 'boolean') updateData.stickyHeaders = data.stickyHeaders
      if (typeof data.autoRefresh === 'boolean') updateData.autoRefresh = data.autoRefresh
    } else if (category === 'EXPORT') {
      if (data.defaultExportFormat) updateData.defaultExportFormat = data.defaultExportFormat
      if (typeof data.includeFilters === 'boolean') updateData.includeFilters = data.includeFilters
      if (typeof data.includeCharts === 'boolean') updateData.includeCharts = data.includeCharts
      if (data.fileNamingTemplate) updateData.fileNamingTemplate = data.fileNamingTemplate
    } else if (category === 'BACKUP') {
      if (data.keepTradeHistory) updateData.keepTradeHistory = data.keepTradeHistory
      if (data.autoBackupFrequency) updateData.autoBackupFrequency = data.autoBackupFrequency
    }

    // Update or create settings
    const settings = await prisma.appSettings.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        ...updateData
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully',
      data: settings
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Bulk update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate that all settings have the required structure
    const settingsToUpdate = Object.entries(body).map(([category, data]) => {
      const validatedData = settingsSchema.parse({ category, data })
      return validatedData
    })

    // Combine all updates
    const updateData: Record<string, unknown> = {}
    
    settingsToUpdate.forEach(({ category, data }) => {
      if (category === 'GENERAL') {
        if (data.defaultInstrument) updateData.defaultInstrument = data.defaultInstrument
        if (data.defaultPosition) updateData.defaultPosition = data.defaultPosition
        if (data.defaultLotSize) updateData.defaultLotSize = data.defaultLotSize
        if (typeof data.autoCalculateCharges === 'boolean') updateData.autoCalculateCharges = data.autoCalculateCharges
        if (typeof data.requireStrategyTag === 'boolean') updateData.requireStrategyTag = data.requireStrategyTag
      } else if (category === 'DISPLAY') {
        if (data.currencySymbol) updateData.currencySymbol = data.currencySymbol
        if (typeof data.decimalPlaces === 'number') updateData.decimalPlaces = data.decimalPlaces
        if (data.thousandsSeparator) updateData.thousandsSeparator = data.thousandsSeparator
        if (data.dateFormat) updateData.dateFormat = data.dateFormat
        if (data.timeFormat) updateData.timeFormat = data.timeFormat
        if (data.theme) updateData.theme = data.theme
      } else if (category === 'TABLE') {
        if (typeof data.defaultPageSize === 'number') updateData.defaultPageSize = data.defaultPageSize
        if (typeof data.denseMode === 'boolean') updateData.denseMode = data.denseMode
        if (typeof data.zebraStriping === 'boolean') updateData.zebraStriping = data.zebraStriping
        if (typeof data.stickyHeaders === 'boolean') updateData.stickyHeaders = data.stickyHeaders
        if (typeof data.autoRefresh === 'boolean') updateData.autoRefresh = data.autoRefresh
      } else if (category === 'EXPORT') {
        if (data.defaultExportFormat) updateData.defaultExportFormat = data.defaultExportFormat
        if (typeof data.includeFilters === 'boolean') updateData.includeFilters = data.includeFilters
        if (typeof data.includeCharts === 'boolean') updateData.includeCharts = data.includeCharts
        if (data.fileNamingTemplate) updateData.fileNamingTemplate = data.fileNamingTemplate
      } else if (category === 'BACKUP') {
        if (data.keepTradeHistory) updateData.keepTradeHistory = data.keepTradeHistory
        if (data.autoBackupFrequency) updateData.autoBackupFrequency = data.autoBackupFrequency
      }
    })

    // Update or create settings
    const settings = await prisma.appSettings.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        ...updateData
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'All settings updated successfully',
      data: settings
    })
  } catch (error) {
    console.error('Error bulk updating settings:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}