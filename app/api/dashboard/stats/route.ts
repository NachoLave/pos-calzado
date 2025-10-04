/**
 * API Route para obtener estadísticas del dashboard
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import { getSession } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Filtro de sucursal según permisos
    const branchFilter = session.permisos.verVentasTodasSucursales
      ? {}
      : { sucursalId: new ObjectId(session.sucursalId) }

    // Ventas de hoy
    const todaySales = await db
      .collection(Collections.SALES)
      .aggregate([
        {
          $match: {
            ...branchFilter,
            fecha: { $gte: today },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ])
      .toArray()

    // Ventas del mes
    const monthSales = await db
      .collection(Collections.SALES)
      .aggregate([
        {
          $match: {
            ...branchFilter,
            fecha: { $gte: firstDayOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ])
      .toArray()

    // Ventas por sucursal (solo la del usuario si no tiene permiso)
    const branchSales = await db
      .collection(Collections.SALES)
      .aggregate([
        {
          $match: {
            sucursalId: new ObjectId(session.sucursalId),
            fecha: { $gte: firstDayOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ])
      .toArray()

    // Top proveedor (productos más vendidos)
    const topSupplier = await db
      .collection(Collections.SALES)
      .aggregate([
        {
          $match: {
            ...branchFilter,
            fecha: { $gte: firstDayOfMonth },
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: Collections.PRODUCT_VARIANTS,
            localField: "items.varianteProductoId",
            foreignField: "_id",
            as: "variante",
          },
        },
        { $unwind: "$variante" },
        {
          $lookup: {
            from: Collections.PRODUCTS,
            localField: "variante.productoBaseId",
            foreignField: "_id",
            as: "producto",
          },
        },
        { $unwind: "$producto" },
        {
          $lookup: {
            from: Collections.SUPPLIERS,
            localField: "producto.proveedorId",
            foreignField: "_id",
            as: "proveedor",
          },
        },
        { $unwind: "$proveedor" },
        {
          $group: {
            _id: "$proveedor._id",
            nombre: { $first: "$proveedor.nombre" },
            productsSold: { $sum: "$items.cantidad" },
          },
        },
        { $sort: { productsSold: -1 } },
        { $limit: 1 },
      ])
      .toArray()

    // Ventas mensuales por sucursal (últimos 6 meses)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlySales = await db
      .collection(Collections.SALES)
      .aggregate([
        {
          $match: {
            ...branchFilter,
            fecha: { $gte: sixMonthsAgo },
          },
        },
        {
          $lookup: {
            from: Collections.BRANCHES,
            localField: "sucursalId",
            foreignField: "_id",
            as: "sucursal",
          },
        },
        { $unwind: "$sucursal" },
        {
          $group: {
            _id: {
              month: { $month: "$fecha" },
              year: { $year: "$fecha" },
              sucursal: "$sucursal.nombre",
            },
            total: { $sum: "$total" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ])
      .toArray()

    // Formatear datos para el gráfico
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const chartData = monthlySales.map((item) => ({
      month: monthNames[item._id.month - 1],
      [item._id.sucursal]: item.total,
    }))

    // Consolidar datos por mes
    const consolidatedData: any = {}
    chartData.forEach((item) => {
      const month = item.month
      if (!consolidatedData[month]) {
        consolidatedData[month] = { month }
      }
      Object.keys(item).forEach((key) => {
        if (key !== "month") {
          consolidatedData[month][key] = item[key]
        }
      })
    })

    return NextResponse.json({
      todaySales: todaySales[0]?.total || 0,
      monthSales: monthSales[0]?.total || 0,
      branchSales: branchSales[0]?.total || 0,
      topSupplier: topSupplier[0]
        ? {
            name: topSupplier[0].nombre,
            productsSold: topSupplier[0].productsSold,
          }
        : {
            name: "N/A",
            productsSold: 0,
          },
      monthlySales: Object.values(consolidatedData),
    })
  } catch (error) {
    console.error("[v0] Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
