import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Tabs } from '@/components/common/Tabs';
import { Select, SelectOption } from '@/components/common/Select';
import { Badge } from '@/components/common/Badge';
import {
  User,
  Bell,
  Palette,
  Save,
  Mail,
  Shield,
  Globe,
} from 'lucide-react';

const languageOptions: SelectOption[] = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt' },
];

const timezoneOptions: SelectOption[] = [
  { label: 'GMT-3 (Buenos Aires)', value: 'America/Argentina/Buenos_Aires' },
  { label: 'GMT-5 (New York)', value: 'America/New_York' },
  { label: 'GMT-6 (Mexico City)', value: 'America/Mexico_City' },
  { label: 'GMT+0 (London)', value: 'Europe/London' },
  { label: 'GMT+1 (Madrid)', value: 'Europe/Madrid' },
];

const themeOptions: SelectOption[] = [
  { label: 'Claro', value: 'light' },
  { label: 'Oscuro', value: 'dark' },
  { label: 'Sistema', value: 'system' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [language, setLanguage] = useState('es');
  const [timezone, setTimezone] = useState('America/Argentina/Buenos_Aires');
  const [theme, setTheme] = useState('system');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Gestiona tus preferencias y configuración de la cuenta
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="grid w-full grid-cols-3">
          <Tabs.Trigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Tabs.Trigger>
          <Tabs.Trigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </Tabs.Trigger>
          <Tabs.Trigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Apariencia
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información de perfil y datos de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Tu nombre"
                    defaultValue="Usuario"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">
                    Apellido
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Tu apellido"
                    defaultValue="Demo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  <Mail className="mr-2 inline h-4 w-4" />
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  defaultValue="usuario@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Empresa
                </label>
                <Input
                  id="company"
                  placeholder="Nombre de tu empresa"
                  defaultValue="Mi Empresa"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">
                  Cargo
                </label>
                <Input
                  id="position"
                  placeholder="Tu cargo en la empresa"
                  defaultValue="Sales Manager"
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LinkedIn Integration</CardTitle>
              <CardDescription>
                Conecta tu cuenta de LinkedIn para sincronizar contactos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Estado de conexión</span>
                    <Badge variant="secondary">No conectado</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Conecta tu cuenta de LinkedIn para acceder a más funciones
                  </p>
                </div>
                <Button>Conectar</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración Regional</CardTitle>
              <CardDescription>
                Personaliza el idioma y zona horaria de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="language" className="text-sm font-medium">
                  <Globe className="mr-2 inline h-4 w-4" />
                  Idioma
                </label>
                <Select
                  options={languageOptions}
                  value={language}
                  onChange={setLanguage}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium">
                  Zona horaria
                </label>
                <Select
                  options={timezoneOptions}
                  value={timezone}
                  onChange={setTimezone}
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones por Email</CardTitle>
              <CardDescription>
                Configura qué notificaciones deseas recibir por correo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Nuevos leads</span>
                  <p className="text-sm text-muted-foreground">
                    Recibe un email cuando se agregue un nuevo lead
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Respuestas de leads</span>
                  <p className="text-sm text-muted-foreground">
                    Notificación cuando un lead responda tu mensaje
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Resumen diario</span>
                  <p className="text-sm text-muted-foreground">
                    Recibe un resumen diario de tu actividad
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Actualizaciones de campaña</span>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones sobre el progreso de tus campañas
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar preferencias
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificaciones en la Aplicación</CardTitle>
              <CardDescription>
                Gestiona las notificaciones dentro de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Notificaciones de sistema</span>
                  <p className="text-sm text-muted-foreground">
                    Alertas importantes sobre el funcionamiento del sistema
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Sonidos de notificación</span>
                  <p className="text-sm text-muted-foreground">
                    Reproducir sonido cuando llegue una notificación
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar preferencias
                </Button>
              </div>
            </CardContent>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema de la Interfaz</CardTitle>
              <CardDescription>
                Personaliza la apariencia de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="theme" className="text-sm font-medium">
                  Tema
                </label>
                <Select
                  options={themeOptions}
                  value={theme}
                  onChange={setTheme}
                />
                <p className="text-sm text-muted-foreground">
                  Elige entre tema claro, oscuro o seguir la configuración del
                  sistema
                </p>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalización</CardTitle>
              <CardDescription>
                Ajusta otros aspectos visuales de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Modo compacto</span>
                  <p className="text-sm text-muted-foreground">
                    Reduce el espaciado entre elementos
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Animaciones</span>
                  <p className="text-sm text-muted-foreground">
                    Habilitar animaciones y transiciones
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar cambios
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Shield className="mr-2 inline h-4 w-4" />
                Privacidad y Seguridad
              </CardTitle>
              <CardDescription>
                Configura opciones de privacidad y seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Autenticación de dos factores</span>
                  <p className="text-sm text-muted-foreground">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <Button variant="outline">Configurar</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Sesiones activas</span>
                  <p className="text-sm text-muted-foreground">
                    Gestiona los dispositivos donde tienes sesión iniciada
                  </p>
                </div>
                <Button variant="outline">Ver sesiones</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <span className="font-medium">Cambiar contraseña</span>
                  <p className="text-sm text-muted-foreground">
                    Actualiza tu contraseña regularmente
                  </p>
                </div>
                <Button variant="outline">Cambiar</Button>
              </div>
            </CardContent>
          </Card>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default Settings;
