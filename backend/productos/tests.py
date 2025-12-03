from django.test import TestCase
from decimal import Decimal
from productos.models import (
    CategoriaProducto, 
    Producto, 
    InventarioSucursal, 
    MovimientoInventario
)
from empresas.models import Empresa, Sucursal


class ProductoUtilsTestCase(TestCase):
    """Tests for Producto utility methods"""
    
    def setUp(self):
        self.empresa = Empresa.objects.create(
            nombre="Empresa Test",
            rfc="TEST123456789"
        )
        self.sucursal1 = Sucursal.objects.create(
            empresa=self.empresa,
            nombre="Sucursal 1"
        )
        self.sucursal2 = Sucursal.objects.create(
            empresa=self.empresa,
            nombre="Sucursal 2"
        )
        self.producto = Producto.objects.create(
            empresa=self.empresa,
            nombre="Producto Test",
            precio_venta=Decimal("100.00"),
            costo=Decimal("50.00")
        )
        
    def test_get_margen_ganancia(self):
        """Test profit margin calculation"""
        margen = self.producto.get_margen_ganancia()
        self.assertEqual(margen, Decimal("50.00"))
        
    def test_get_margen_ganancia_sin_costo(self):
        """Test profit margin when no cost is set"""
        self.producto.costo = None
        self.producto.save()
        self.assertIsNone(self.producto.get_margen_ganancia())
        
    def test_get_margen_porcentaje(self):
        """Test profit margin percentage calculation"""
        porcentaje = self.producto.get_margen_porcentaje()
        self.assertEqual(porcentaje, 100.0)  # 50/50 * 100 = 100%
        
    def test_get_margen_porcentaje_sin_costo(self):
        """Test profit margin percentage when no cost is set"""
        self.producto.costo = None
        self.producto.save()
        self.assertIsNone(self.producto.get_margen_porcentaje())
        
    def test_get_margen_porcentaje_costo_cero(self):
        """Test profit margin percentage when cost is zero"""
        self.producto.costo = Decimal("0.00")
        self.producto.save()
        self.assertIsNone(self.producto.get_margen_porcentaje())
        
    def test_has_stock_sin_inventario(self):
        """Test has_stock when no inventory exists"""
        self.assertFalse(self.producto.has_stock())
        
    def test_has_stock_con_stock(self):
        """Test has_stock when inventory with stock exists"""
        InventarioSucursal.objects.create(
            sucursal=self.sucursal1,
            producto=self.producto,
            stock_actual=10
        )
        self.assertTrue(self.producto.has_stock())
        
    def test_has_stock_sin_stock(self):
        """Test has_stock when inventory exists but stock is 0"""
        InventarioSucursal.objects.create(
            sucursal=self.sucursal1,
            producto=self.producto,
            stock_actual=0
        )
        self.assertFalse(self.producto.has_stock())
        
    def test_get_stock_total(self):
        """Test total stock calculation across branches"""
        InventarioSucursal.objects.create(
            sucursal=self.sucursal1,
            producto=self.producto,
            stock_actual=10
        )
        InventarioSucursal.objects.create(
            sucursal=self.sucursal2,
            producto=self.producto,
            stock_actual=15
        )
        self.assertEqual(self.producto.get_stock_total(), 25)
        
    def test_get_stock_total_sin_inventario(self):
        """Test total stock when no inventory exists"""
        self.assertEqual(self.producto.get_stock_total(), 0)
        
    def test_get_stock_by_sucursal(self):
        """Test stock for a specific branch"""
        InventarioSucursal.objects.create(
            sucursal=self.sucursal1,
            producto=self.producto,
            stock_actual=10
        )
        self.assertEqual(self.producto.get_stock_by_sucursal(self.sucursal1), 10)
        
    def test_get_stock_by_sucursal_sin_inventario(self):
        """Test stock for branch without inventory"""
        self.assertEqual(self.producto.get_stock_by_sucursal(self.sucursal1), 0)
        
    def test_es_bajo_stock(self):
        """Test low stock detection"""
        InventarioSucursal.objects.create(
            sucursal=self.sucursal1,
            producto=self.producto,
            stock_actual=3
        )
        self.assertTrue(self.producto.es_bajo_stock(umbral=5))
        self.assertFalse(self.producto.es_bajo_stock(umbral=2))
        
    def test_tiene_costo(self):
        """Test has cost property"""
        self.assertTrue(self.producto.tiene_costo)
        self.producto.costo = None
        self.producto.save()
        self.assertFalse(self.producto.tiene_costo)
        
    def test_esta_activo(self):
        """Test is active property"""
        self.assertFalse(self.producto.esta_activo)
        InventarioSucursal.objects.create(
            sucursal=self.sucursal1,
            producto=self.producto,
            stock_actual=10
        )
        self.assertTrue(self.producto.esta_activo)


class InventarioSucursalUtilsTestCase(TestCase):
    """Tests for InventarioSucursal utility methods"""
    
    def setUp(self):
        self.empresa = Empresa.objects.create(
            nombre="Empresa Test",
            rfc="TEST123456789"
        )
        self.sucursal = Sucursal.objects.create(
            empresa=self.empresa,
            nombre="Sucursal Test"
        )
        self.producto = Producto.objects.create(
            empresa=self.empresa,
            nombre="Producto Test",
            precio_venta=Decimal("100.00")
        )
        self.inventario = InventarioSucursal.objects.create(
            sucursal=self.sucursal,
            producto=self.producto,
            stock_actual=10
        )
        
    def test_has_stock_con_stock(self):
        """Test has_stock when stock is available"""
        self.assertTrue(self.inventario.has_stock())
        
    def test_has_stock_sin_stock(self):
        """Test has_stock when stock is 0"""
        self.inventario.stock_actual = 0
        self.inventario.save()
        self.assertFalse(self.inventario.has_stock())
        
    def test_es_bajo_stock(self):
        """Test low stock detection"""
        self.inventario.stock_actual = 3
        self.inventario.save()
        self.assertTrue(self.inventario.es_bajo_stock(umbral=5))
        self.assertFalse(self.inventario.es_bajo_stock(umbral=2))
        
    def test_esta_agotado(self):
        """Test out of stock property"""
        self.assertFalse(self.inventario.esta_agotado)
        self.inventario.stock_actual = 0
        self.inventario.save()
        self.assertTrue(self.inventario.esta_agotado)
        
    def test_nivel_stock_normal(self):
        """Test stock level when normal"""
        self.assertEqual(self.inventario.nivel_stock, 'normal')
        
    def test_nivel_stock_bajo(self):
        """Test stock level when low"""
        self.inventario.stock_actual = 3
        self.inventario.save()
        self.assertEqual(self.inventario.nivel_stock, 'bajo')
        
    def test_nivel_stock_agotado(self):
        """Test stock level when out of stock"""
        self.inventario.stock_actual = 0
        self.inventario.save()
        self.assertEqual(self.inventario.nivel_stock, 'agotado')


class MovimientoInventarioUtilsTestCase(TestCase):
    """Tests for MovimientoInventario utility methods"""
    
    def setUp(self):
        self.empresa = Empresa.objects.create(
            nombre="Empresa Test",
            rfc="TEST123456789"
        )
        self.sucursal = Sucursal.objects.create(
            empresa=self.empresa,
            nombre="Sucursal Test"
        )
        self.producto = Producto.objects.create(
            empresa=self.empresa,
            nombre="Producto Test",
            precio_venta=Decimal("100.00")
        )
        self.inventario = InventarioSucursal.objects.create(
            sucursal=self.sucursal,
            producto=self.producto,
            stock_actual=10
        )
        self.movimiento = MovimientoInventario.objects.create(
            inventario=self.inventario,
            tipo_movimiento='entrada',
            cantidad=5
        )
        
    def test_es_entrada(self):
        """Test is entrada property"""
        self.assertTrue(self.movimiento.es_entrada)
        self.assertFalse(self.movimiento.es_salida)
        self.assertFalse(self.movimiento.es_ajuste)
        
    def test_es_salida(self):
        """Test is salida property"""
        self.movimiento.tipo_movimiento = 'salida'
        self.movimiento.save()
        self.assertFalse(self.movimiento.es_entrada)
        self.assertTrue(self.movimiento.es_salida)
        self.assertFalse(self.movimiento.es_ajuste)
        
    def test_es_ajuste(self):
        """Test is ajuste property"""
        self.movimiento.tipo_movimiento = 'ajuste'
        self.movimiento.save()
        self.assertFalse(self.movimiento.es_entrada)
        self.assertFalse(self.movimiento.es_salida)
        self.assertTrue(self.movimiento.es_ajuste)
        
    def test_get_tipo_icono_entrada(self):
        """Test icon for entrada movement"""
        self.assertEqual(self.movimiento.get_tipo_icono(), '📥')
        
    def test_get_tipo_icono_salida(self):
        """Test icon for salida movement"""
        self.movimiento.tipo_movimiento = 'salida'
        self.movimiento.save()
        self.assertEqual(self.movimiento.get_tipo_icono(), '📤')
        
    def test_get_tipo_icono_ajuste(self):
        """Test icon for ajuste movement"""
        self.movimiento.tipo_movimiento = 'ajuste'
        self.movimiento.save()
        self.assertEqual(self.movimiento.get_tipo_icono(), '🔧')
        
    def test_descripcion_completa(self):
        """Test complete description property"""
        descripcion = self.movimiento.descripcion_completa
        self.assertIn('📥', descripcion)
        self.assertIn('Entrada', descripcion)
        self.assertIn('5', descripcion)
        self.assertIn('Producto Test', descripcion)
        self.assertIn('Sucursal Test', descripcion)
