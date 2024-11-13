import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X, Mail, Shield, Calendar, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import LoadingOverlay from './LoadingOverlay';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, isLoading } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState<string | undefined>(user?.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setTempProfileImage(user.profileImage);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 2MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Error al procesar la imagen');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        firstName,
        lastName,
        profileImage: tempProfileImage
      });
      setIsEditing(false);
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setTempProfileImage(user.profileImage);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative overflow-hidden my-8">
        <LoadingOverlay isLoading={isLoading}>
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 pb-24 text-white relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold">Perfil de Usuario</h2>
          </div>

          <div className="p-4 sm:p-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center -mt-20 mb-6 relative z-10">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white shadow-lg ring-4 ring-white">
                  {tempProfileImage ? (
                    <img
                      src={tempProfileImage}
                      alt="Perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600">
                      <span className="text-3xl sm:text-4xl font-bold">
                        {firstName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 sm:p-2.5 rounded-full hover:bg-indigo-700 shadow-lg transition-all duration-200 transform hover:scale-105"
                    title="Cambiar foto de perfil"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ingresa tus nombres"
                    />
                  ) : (
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 rounded-lg border border-transparent">
                      <p className="text-gray-900 font-medium">{firstName}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ingresa tus apellidos"
                    />
                  ) : (
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 rounded-lg border border-transparent">
                      <p className="text-gray-900 font-medium">{lastName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      Correo electrónico
                    </div>
                  </label>
                  <p className="text-gray-900 font-medium break-all">{user.email}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      Rol
                    </div>
                  </label>
                  <p className="text-gray-900 font-medium">{user.roleDescription}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Fecha de registro
                    </div>
                  </label>
                  <p className="text-gray-900 font-medium">
                    {format(new Date(user.createdAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Guardar Cambios
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Editar Perfil
                  </button>
                )}
              </div>
            </form>
          </div>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export default UserProfile;